const express = require("express");
const cors = require("cors");
const routes = require("./routes/index.routes");
require("./connection");

let app = express();

app.use(cors());
app.use(express.urlencoded({ extended: "true" }));
app.use(express.json());

app.use(routes);

module.exports = app;
