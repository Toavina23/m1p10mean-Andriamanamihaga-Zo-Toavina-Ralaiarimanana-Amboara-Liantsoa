const express = require("express");
const {
	createNewAppointment,
	getUserAppointments,
} = require("../handlers/appointment.handler");
const { isAuthenticated, isCustomer } = require("../auth-middleware");

const appointmentRouter = express.Router();
appointmentRouter.post("/", createNewAppointment);
appointmentRouter.get("/", isAuthenticated, isCustomer, getUserAppointments);
module.exports = appointmentRouter;
