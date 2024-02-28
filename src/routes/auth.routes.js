const express = require("express");
const {
	register,
	authenticate,
	confirmUserEmail,
	resendValidationCode
} = require("../handlers/auth.handler");

const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", authenticate);
authRouter.post("/confirmEmail", confirmUserEmail);
authRouter.post("/resendCode", resendValidationCode);
module.exports = authRouter;
