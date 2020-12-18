const { getMongoDB } = require("../../services/mongo")
const R = require('rambda')
const { logger } = require("../../services/logging")

let collection = () => getMongoDB().collection('images')

const uploadHandler = async (req, res) => {
	const fileList = R.pathOr([], ['body', 'fileList'])(req) 
	const password = R.pathOr(null, ['body', 'password'])(req)
	const isProtected = !R.isNil(password)

	const uniqueId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

	const returnable = []
	
	const uploadOne = async(file) => { 
		try { 
			const insertedResult = await collection.insertOne({password, fileContent: R.path(['fileContent'])(file), name: R.pathOr(uniqueId(), ['name'])(file)})
			returnable.push({id: insertedResult, protected: isProtected, name: insertedResult.name})
		} catch (err) { 
			logger.error(err)
			res.status(504).send(err)
			return 
		}
	}

	await R.forEach(uploadOne, fileList)

	res.status(204).send(returnable)
}
	
const searchHandler = async (req, res) => {
	try {

        const params = ['tags', 'name']

        let query = {}

        const buildQuery = (param) => {
            const searchString = R.pathOr(null, ['query', param], req)
            if (!R.isNil(searchString)) 
                query[param] = { '$regex': searchString }
        }

        R.forEach(buildQuery, params)
         
        const queryResult = await collection()
            .find(query)
            .toArray()
		logger.info(`[DB] Found ${queryResult.length} images`)
		res.send(queryResult)
	

    } catch (e) {
        logger.error('[DB] Could not query api request log\n%o', e)
    }
}
	
const findHandler = (req, res) => {
	
}
	
