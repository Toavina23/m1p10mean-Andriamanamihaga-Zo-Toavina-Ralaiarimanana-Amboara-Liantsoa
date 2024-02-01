const express = require("express");
const { register, authenticate } = require("../handlers/auth.handler");

const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", authenticate);
module.exports = authRouter;
