const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");

const { connectMongo } = require("./services/mongo");

const { logger, expressLogger } = require("./services/logging");
const { loadModelAndCache } = require("./services/recognition");

const { declareImageRoutes } = require("./api/imageRoutes");

// Constants
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";

// Create the basic app
const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());

if (process.env.NODE_ENV === "production") {
  app.use(compression());
}

app.use(helmet());

app.use(expressLogger);

// Init application
app.promiseListen = function promiseListen(port, host) {
  return new Promise((resolve, reject) =>
    this.listen(port, host, (err) => (!err ? resolve() : reject(err)))
  );
};

app.set("json spaces", 2);

async function runServer() {
  // connect to MongoDB Atlas
  await connectMongo("mvp");

  // declare routes
  declareImageRoutes(app);

  // initialize model in memory
  logger.info("[Server Startup] Loading ML Model");
  await loadModelAndCache();

  // Start server
  await app.promiseListen(PORT, HOST);
  logger.info(`[Server Startup] Running on http://${HOST}:${PORT}`);
}

runServer().catch((e) =>
  logger.info(`[Server] Unexpected error found! ${e.message}\n%o`, e)
);
