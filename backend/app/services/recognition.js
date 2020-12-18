const { logger } = require("./logging")
const tf = require('@tensorflow/tfjs-node');
const cocossd = require('@tensorflow-models/coco-ssd');
const toUint8Array = require('base64-to-uint8array')

const loadModel = async() => {
	const model = await cocossd.load({
		base: 'mobilenet_v2'
	})
	return model;
}

const getTensor = (imageData) => {
	const mime = imageData.split(';')[0]
	const imageArray = toUint8Array(imageData.split(',')[1]);
	let tensor

	if(mime.endsWith('jpeg')) { 
		tensor = tf.node.decodeJpeg(imageArray, 3);
	} else {
		tensor = tf.node.decodePng(imageArray, 8)
	}
	logger.info("[Recognition] Built tensor successfully.")
	return tensor;
}

const getImageTags = async(b64Image) => {
	try {
		logger.info("[Recognition] Starting Object Recognition")
		const tensor = getTensor(b64Image)
		const model =  await loadModel();
		logger.info("[Recognition] Detecting tensor")
		const tags = await model.detect(tensor);

		logger.info("[Recognition] Formatting results")
		tags.forEach((element, index) => {
			tags[index] = element.class
		})

		logger.info(`[Recognition] Found tags: ${tags.join(',')}`)
		return tags.join(', ')

	} catch (err) {
		logger.error(`Error retrieving tags: ${err.message}`)
	}
	
}
module.exports = {
	getImageTags,
}