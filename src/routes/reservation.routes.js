const express = require("express");
const { getLastAppointments } = require("../handlers/appointment.handler");

const reservationRouter = express.Router();

reservationRouter.get('', getLastAppointments);

module.exports = reservationRouter