const express = require("express");
const { fetchServices, getEmployeeAvailableForService, findService, newService, updateService, deleteService } = require("../handlers/service.handler");
const serviceRouter = express.Router();

serviceRouter.get("/", fetchServices);
serviceRouter.get("/:serviceId/employees", getEmployeeAvailableForService);
serviceRouter.get("/:id", findService)
serviceRouter.post("", newService)
serviceRouter.put("/:id", updateService)
serviceRouter.delete("/:id", deleteService)

module.exports = serviceRouter;
