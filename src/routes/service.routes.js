const express = require("express");
const { fetchServices, getEmployeeAvailableForService } = require("../handlers/service.handler");
const serviceRouter = express.Router();

serviceRouter.get("/", fetchServices);
serviceRouter.get("/:serviceId/employees", getEmployeeAvailableForService);

module.exports = serviceRouter;
