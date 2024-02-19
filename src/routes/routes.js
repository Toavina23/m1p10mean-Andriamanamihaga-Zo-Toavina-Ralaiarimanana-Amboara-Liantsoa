const express = require("express");
const authRouter = require("./auth.routes");
const employeeRouter = require("./employee.routes");
const serviceRouter = require("./service.routes");
const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/services", serviceRouter);
mainRouter.use("/employees", employeeRouter);

module.exports = mainRouter;
