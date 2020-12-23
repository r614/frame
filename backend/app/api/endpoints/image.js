const { getMongoDb } = require("../../services/mongo");
var ObjectId = require("mongodb").ObjectId;
const fileType = require("file-type");
const R = require("rambda");
const { logger } = require("../../services/logging");
const { getImageTags } = require("../../services/recognition");

let collection = () => getMongoDb().collection("images");

const uploadHandler = async (req, res) => {
  let fileList = R.pathOr([], ["body", "files"])(req);
  if (R.length(fileList === 0)) {
    res.status(400).send();
  }
  const password = R.pathOr(null, ["body", "password"])(req);
  const isProtected = !R.isNil(password);

  const uniqueId = () =>
    Date.now().toString(36) + Math.random().toString(36).substring(2);
  const uploadMany = async (files) => {
    return collection().insertMany(files, { ordered: true });
  };
  const uploadOne = async (file) => {
    return collection().insertOne(file);
  };

  const mutateFileSpec = async (file) => {
    const name = R.pathOr(uniqueId(), ["name"])(file);
    const tags = await getImageTags(file.base64);
    return {
      password,
      name,
      protected: isProtected,
      fileContent: file.base64,
      tags,
    };
  };

  try {
    fileList = await Promise.all(
      fileList.map(async (item) => {
        return await mutateFileSpec(item);
      })
    );

    if (R.length(fileList) === 1) {
      const insertedResult = await uploadOne(fileList[0]);
      logger.info(
        `Successfully persisted file: _id ${insertedResult.insertedId} `
      );
      res.json([
        {
          id: insertedResult.insertedId,
          name: fileList[0].name,
          protected: isProtected,
        },
      ]);
      return;
    } else {
      const insertedResults = await uploadMany(fileList);
      let uploadedFiles = insertedResults.ops;
      uploadedFiles.forEach((element, index) => {
        uploadedFiles[index] = {
          id: element._id,
          name: element.name,
          protected: element.protected,
        };
      });
      logger.info(uploadedFiles);
      logger.info(
        `Successfully persisted mutiple files, ids: ${JSON.stringify(
          insertedResults.insertedIds
        )} `
      );
      res.json(uploadedFiles);
    }
  } catch (err) {
    logger.error(err.message);
    res.status(504).send();
  }
};

const reverseImageSearchHandler = async (req, res) => {
  let fileList = R.pathOr([], ["body", "files"])(req);
  if (R.isEmpty(fileList)) res.send(404);

  let tags = await getImageTags(fileList[0].base64);
  tags = tags.replace(",", "");

  const query = { $text: { $search: tags } };
  let queryResult = await collection()
    .find(query)
    .project({ _id: 1, tags: 1, protected: 1, name: 1 })
    .limit(20)
    .toArray();
  queryResults = R.reject((o) => o.protected, queryResult);

  logger.info(`[DB] Found ${queryResult.length} images`);
  logger.info(`${JSON.stringify(queryResult)}`);

  res.send(queryResult);
};

const searchHandler = async (req, res) => {
  let searchQuery = R.pathOr("", ["query", "tags"])(req);

  let query = { $text: { $search: searchQuery } };

  if (req.params.name) {
    searchQuery = R.pathOr("", ["params", "names"])(req);
    query = { name: searchQuery } };
  }

  logger.info(JSON.stringify(query));
  let queryResult = await collection()
    .find(query)
    .project({ _id: 1, tags: 1, name: 1, protected: 1 })
    .limit(20)
    .toArray();

  queryResult = R.reject((o) => o.protected, queryResult);

  logger.info(`[DB] Found ${queryResult.length} public images`);
  logger.info(`${JSON.stringify(queryResult)}`);

  res.send(queryResult);
};

const findHandler = async (req, res) => {
  const imageId = req.params.id;
  if (!ObjectId.isValid(imageId)) {
    res.set("statusText", "Error: ImageID is invalid, check your URL");
    return res.status(422).send();
  }

  const password = R.pathOr("", ["query", "password"], req);

  logger.info(`[GET FILE] fileId=${imageId}, password=${password}`);
  const query = password
    ? { _id: new ObjectId(imageId), password: password }
    : { _id: new ObjectId(imageId) };

  const image = await collection().findOne(query);

  if (!R.isNil(image)) {
    if (R.not(R.equals( R.isNil(image.password) ? "": image.password , password))) {
      logger.info(
        `Passwords dont match: ${password}, image password: ${image.password}`
      );
      res.set("statusText", "Error; Incorrect Password");
      res.status(401).send();
      return;
    }

    let base64ContentArray = R.pathOr("", ["fileContent"], image).split(",");
    let mime = base64ContentArray[0].match(
      /[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/
    )[0];
    let ext = mime.split("/")[1];

    logger.info(`id: ${image._id}, mime: ${mime}, ext: ${ext}`);
    res.set("Content-Type", mime);
    res.set(
      "Content-Disposition",
      `attachment;filename=${imageId}-${new Date(
        Date.now()
      ).toLocaleDateString()}.${ext}`
    );
    res.end(Buffer.from(base64ContentArray[1], "base64"));
  } else {
    res.status(404).send();
  }
};

module.exports = {
  uploadHandler,
  searchHandler,
  findHandler,
  reverseImageSearchHandler,
};
