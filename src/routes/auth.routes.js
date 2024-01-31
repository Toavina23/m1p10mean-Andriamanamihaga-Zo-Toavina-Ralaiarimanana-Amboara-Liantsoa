const express = require("express");
const { register } = require("../handlers/auth.handler");

const authRouter = express.Router();
authRouter.post(
	"/register",
	register
);
module.exports = authRouter;
