const express = require("express");
const { validatePromotionCode } = require("../handlers/promoCode.handler");

const promoCodeRouter = express.Router();
promoCodeRouter.get("/:code", validatePromotionCode);
module.exports = promoCodeRouter;
