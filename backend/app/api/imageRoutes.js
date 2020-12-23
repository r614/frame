const { Router } = require("express");
const { logger } = require("../services/logging");
const {
  uploadHandler,
  searchHandler,
  findHandler,
  reverseImageSearchHandler,
} = require("./endpoints/image");

const routerOptions = {
  mergeParams: true,
  strict: true,
};

const declareImageRoutes = (app) => {
  const route = "/";
  const router = Router(routerOptions);

  router.post("/upload", uploadHandler);
  router.get("/:id", findHandler);
  router.post("/search", searchHandler);
  router.post("/reverse", reverseImageSearchHandler);

  app.use(route, router);

  logger.info(`[API] Image routes registered`);
};

module.exports = {
  declareImageRoutes,
};
