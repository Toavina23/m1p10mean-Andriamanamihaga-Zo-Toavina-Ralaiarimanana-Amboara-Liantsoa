const express = require("express");
const {
	createNewAppointment,
	getUserAppointments,
	getAppointmentDetails,
	getLastAppointments,
} = require("../handlers/appointment.handler");
const { isAuthenticated, isCustomer } = require("../auth-middleware");

const appointmentRouter = express.Router();
appointmentRouter.get("/last", getLastAppointments);
appointmentRouter.post("/", isAuthenticated, createNewAppointment);
appointmentRouter.get("/", isAuthenticated, getUserAppointments);
appointmentRouter.get(
	"/:id",
	isAuthenticated,
	getAppointmentDetails
);
module.exports = appointmentRouter;
