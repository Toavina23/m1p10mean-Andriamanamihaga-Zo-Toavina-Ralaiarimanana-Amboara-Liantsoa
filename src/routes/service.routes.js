const express = require("express");
const { fetchServices } = require("../handlers/service.handler");
const serviceRouter = express.Router();

serviceRouter.get("/", fetchServices);
module.exports = serviceRouter;
