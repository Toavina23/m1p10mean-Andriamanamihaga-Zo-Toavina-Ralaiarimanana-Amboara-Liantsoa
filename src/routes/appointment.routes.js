const express = require("express");
const { createNewAppointment } = require("../handlers/appointment.handler");

const appointmentRouter = express.Router();
appointmentRouter.post("/", createNewAppointment);
module.exports = appointmentRouter;
