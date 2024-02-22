const express = require("express")
const { newService, getServices, findService, updateService, deleteService } = require('../handlers/services.handler')

const serviceRouter = express.Router()

serviceRouter.get("", getServices)
serviceRouter.get("/:id", findService)
serviceRouter.post("", newService)
serviceRouter.put("/:id", updateService)
serviceRouter.delete("/:id", deleteService)

module.exports = serviceRouter