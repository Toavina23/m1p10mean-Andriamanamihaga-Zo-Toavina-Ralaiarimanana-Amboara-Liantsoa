const express = require("express");

const {
	createAppointmentPaymentIntent,
} = require("../handlers/payment.handler");

const paymentRouter = express.Router();

paymentRouter.post("/paymentIntents", createAppointmentPaymentIntent);

module.exports = paymentRouter;
