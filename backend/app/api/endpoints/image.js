const { getMongoDB } = require("../../services/mongo")
const R = require('rambda')

let collection = getMongoDB().collection('images')

const uploadHandler = (req, res) => {
	const fileList = R.pathOr([], ['body', 'fileList'])(req) 
	const protected = R.pathOr(false, ['body', 'protected'])(req)
	const processFile = (file) => {
		
	}
}
	
const searchHandler = (req, res) => {
	
}
	
const findHandler = (req, res) => {
	
}
	
