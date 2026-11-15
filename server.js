const express = require("express");
const path = require("path");
const { getRouter } = require("stremio-addon-sdk");
const addonInterface = require("./addon");

const app = express();
const port = process.env.PORT || 7000;

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", getRouter(addonInterface));

app.listen(port, () => {
    console.log(`Addon active on port ${port}`);
    console.log(`http://127.0.0.1:${port}/manifest.json`);
});
