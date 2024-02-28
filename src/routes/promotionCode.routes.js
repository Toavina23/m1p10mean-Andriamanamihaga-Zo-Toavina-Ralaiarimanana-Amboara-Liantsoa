const express = require("express");
const { validatePromotionCode } = require("../handlers/promoCode.handler");
const { isAuthenticated, isCustomer } = require("../auth-middleware");

const promoCodeRouter = express.Router();
promoCodeRouter.get(
	"/:code",
	isAuthenticated,
	isCustomer,
	validatePromotionCode
);
module.exports = promoCodeRouter;
