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
appointmentRouter.post("/", isAuthenticated, isCustomer, createNewAppointment);
appointmentRouter.get("/", isAuthenticated, isCustomer, getUserAppointments);
appointmentRouter.get(
	"/:id",
	isAuthenticated,
	isCustomer,
	getAppointmentDetails
);
module.exports = appointmentRouter;
