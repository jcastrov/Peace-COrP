/* eslint no-console: "off" */
import express from "express";
import path from "path";
const app = express();
const port = 8079;

// Strings
const SRC = "src";
const NODE_MODULES = "node_modules";
const VIEWS = `${SRC}/views`;
const BOOTSTRAP = `${NODE_MODULES}/bootstrap/dist`;

// Functions
const use = (thePath) => {
  app.use(express.static(path.join(__dirname, path.normalize(thePath))));
};
const get = (urlPath, file) => {
  const func = (request, response) => {
    response.sendFile(path.join(__dirname, file));
  };

  app.get(urlPath, func);
};

use(`${BOOTSTRAP}/css`);
use(`${BOOTSTRAP}/js`);
use(`${NODE_MODULES}/jquery/dist`);
use(`${NODE_MODULES}/tether/dist/js`);
use(`${NODE_MODULES}/font-awesome`);
use(`${NODE_MODULES}/phaser-ce/build`);
use(`${SRC}/js`);
use("dist");
use(`${SRC}/images`);

get("/", `index.html`);

const SUCCESFUL = `Server running at http://localhost:${port}/`;

app.listen(port, () => console.log(SUCCESFUL));