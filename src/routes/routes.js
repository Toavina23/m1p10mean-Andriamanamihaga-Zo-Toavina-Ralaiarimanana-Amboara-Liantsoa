const express = require("express");
const authRouter = require("./auth.routes");
const paymentRouter = require("./payment.routes");
const employeeRouter = require("./employee.routes");
const serviceRouter = require("./service.routes");
const appointmentRouter = require("./appointment.routes");
const promoCodeRouter = require("./promotionCode.routes");
const taskRouter = require("./task.routes");
const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/services", serviceRouter);
mainRouter.use("/employees", employeeRouter);
mainRouter.use("/payments", paymentRouter);
mainRouter.use("/appointments", appointmentRouter);
mainRouter.use("/promotionCodes", promoCodeRouter);
mainRouter.use("/tasks", taskRouter);

module.exports = mainRouter;
