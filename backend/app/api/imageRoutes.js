const { Router } = require('express')
const { logger } = require('../services/logging')
const { uploadHandler, searchHandler, findHandler } = require('./endpoints/image')

const routerOptions = {
    mergeParams: true,
    strict: true,
}

const declareImageRoutes = (app) => {
    const route = '/'
    const router = Router(routerOptions)

    router.post('/upload', uploadHandler)
    router.get('/', findHandler)
    router.search('/search', searchHandler)

    app.use(route, router)

    logger.info(`[API] Image routes registered`)
}



module.exports = {
    declareImageRoutes,
}