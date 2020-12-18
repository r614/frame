const { getMongoDb } = require("../../services/mongo")
const R = require('rambda')
const { logger } = require("../../services/logging")
const { getImageTags } = require("../../services/recognition")

let collection = () => getMongoDb().collection('images')

const uploadHandler = async (req, res) => {
	const fileList = R.pathOr([], ['body', 'files'])(req) 
	if(R.length(fileList === 0)) {
		res.status(400).send()
	}
	const password = R.pathOr(null, ['body', 'password'])(req)
	const isProtected = !R.isNil(password)

	const uniqueId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);	
	const uploadMany = async(files) => { 
		return collection().insertMany(files, {ordered: true})
	}
	const uploadOne = async(file) => { 
		file["tags"] = await getImageTags(file.fileContent)
		return collection().insertOne(file)
	}

	const mutateFileSpec = (file) => {
		const password = R.pathOr("", ['password'])(file)
		const name = R.pathOr(uniqueId(), ['name'])(file)
		return { password, name, protected: isProtected, fileContent: file.base64 }
	}

	try {
		fileList.forEach((file, index) => {
			fileList[index] = mutateFileSpec(file)
		})

		if(R.length(fileList) === 1) { 
			const insertedResult = await uploadOne(fileList[0])
			logger.info(`Successfully persisted file: _id ${insertedResult.insertedId} `)
			res.json([{id: insertedResult.insertedId, name: fileList[0].name, protected: fileList[0].protected}])
			return 
		} else { 
			const insertedResults = await uploadMany(fileList)
			let uploadedFiles = insertedResults.ops 
			uploadedFiles.forEach((element, index) => {
				uploadedFiles[index] = { id: element._id, name: element.name, protected: element.protected }
			})
			logger.info(uploadedFiles)
			logger.info(`Successfully persisted mutiple files, ids: ${JSON.stringify(insertedResults.insertedIds)} `)
			res.json(uploadedFiles)
		}
	} catch (err) {
		logger.error(err.message)
		res.status(504).send()
	}
}

const reverseImageSearchHandler = async (req, res) => { 

}
	
const searchHandler = async (req, res) => {
        const params = ['tags', 'name']

		let searchQuery = R.pathOr("", ['query', 'tags'])(req)

		const query = { '$text': { '$search': searchQuery } }
		
		logger.info(query)
		const queryResult = await collection().find(query).limit(5).toArray()
		
		logger.info(`[DB] Found ${queryResult.length} images`)
		logger.info(`${queryResult}`)

		res.send(queryResult)
}
	
const findHandler = async (req, res) => {
	const imageId = req.params.id
	const password = req.params.password

	const query = R.isNil(password) ? {_id: imageId } : {_id: imageId, password }

	const image = await collection().findOne(query).toArray()
	if (!R.isEmpty(image)) 
		res.json(image)
	else { 
		res.status(404).send()
	}
}

module.exports = { 
	uploadHandler,
	searchHandler,
	findHandler,
	reverseImageSearchHandler
}
	
