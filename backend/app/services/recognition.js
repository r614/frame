const { logger } = require("./logging");
const tf = require("@tensorflow/tfjs-node");
const cocossd = require("@tensorflow-models/coco-ssd");
const toUint8Array = require("base64-to-uint8array");

let model;

const loadModelAndCache = async () => {
  model = await loadModel();
  logger.info("[Recognition Service] Loaded model successfully.");
  return model;
};

const getModel = async () => {
  if (model) {
    return model;
  } else {
    return await loadModelAndCache();
  }
};

const loadModel = async () => {
  const model = await cocossd.load({
    base: "mobilenet_v2",
  });
  return model;
};

const getTensor = (imageData) => {
  const mime = imageData.split(";")[0];
  const imageArray = toUint8Array(imageData.split(",")[1]);
  let tensor;

  if (mime.endsWith("jpeg")) {
    tensor = tf.node.decodeJpeg(imageArray, 3);
  } else {
    tensor = tf.node.decodePng(imageArray, 8);
  }
  logger.info("[Recognition Service] Built tensor successfully.");
  return tensor;
};

const getImageTags = async (b64Image) => {
  try {
    logger.info("[Recognition Service] Starting Object Recognition");
    const tensor = getTensor(b64Image);
    logger.info("[Recognition Service] Detecting tensor");
    const loaded_model = await getModel();
    const tags = await loaded_model.detect(tensor);

    logger.info("[Recognition Service] Formatting results");
    tags.forEach((element, index) => {
      tags[index] = element.class;
    });

    logger.info(`[Recognition Service] Found tags: ${tags.join(",")}`);
    return tags.join(", ");
  } catch (err) {
    logger.error(`[Recognition Service] Error retrieving tags: ${err.message}`);
  }
};
module.exports = {
  getImageTags,
  loadModelAndCache,
};
