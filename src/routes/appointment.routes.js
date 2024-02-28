const express = require("express");
const {
	createNewAppointment,
	getUserAppointments,
	getAppointmentDetails,
} = require("../handlers/appointment.handler");
const { isAuthenticated, isCustomer } = require("../auth-middleware");

const appointmentRouter = express.Router();
appointmentRouter.post("/", isAuthenticated, isCustomer, createNewAppointment);
appointmentRouter.get("/", isAuthenticated, isCustomer, getUserAppointments);
appointmentRouter.get(
	"/:id",
	isAuthenticated,
	isCustomer,
	getAppointmentDetails
);
module.exports = appointmentRouter;
