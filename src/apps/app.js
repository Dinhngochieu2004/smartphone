const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const {connectionRedis} = require("../common/init.redis");
const app = express();
const config = require("config");
// Config template ejs
app.set("views", config.get("app.viewsFolder"));
app.set("view engine", config.get("app.viewEngine"));
// use
connectionRedis();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use("/asset/uploads/images", express.static(config.get("app.baseImageUrl")));
app.use(
    config.get("app.prefixApiVersion"),
    require(`${__dirname}/../routers/web`)
);

module.exports = app;