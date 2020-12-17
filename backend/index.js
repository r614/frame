// Read .env on development machines
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const onReady = () => {
	require('./app/server')
}

onReady()