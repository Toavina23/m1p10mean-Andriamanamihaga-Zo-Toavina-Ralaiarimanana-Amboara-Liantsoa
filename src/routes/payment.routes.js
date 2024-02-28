const express = require("express");

const {
	createAppointmentPaymentIntent,
} = require("../handlers/payment.handler");
const { isAuthenticated, isCustomer } = require("../auth-middleware");

const paymentRouter = express.Router();

paymentRouter.post(
	"/paymentIntents",
	isAuthenticated,
	isCustomer,
	createAppointmentPaymentIntent
);

module.exports = paymentRouter;
