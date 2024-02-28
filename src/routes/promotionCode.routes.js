const express = require("express");
const { validatePromotionCode, newOffer, getOffers, findOffer, updateOffer, deleteOffer } = require("../handlers/promoCode.handler");
const { isAuthenticated, isCustomer, isManager } = require("../auth-middleware");

const promoCodeRouter = express.Router();
promoCodeRouter.get(
	"/:code",
	isAuthenticated,
	isCustomer,
	validatePromotionCode
);
promoCodeRouter.get('', getOffers);
promoCodeRouter.get('/id/:id', findOffer);
promoCodeRouter.post('', newOffer);
promoCodeRouter.put('/:id', updateOffer);
promoCodeRouter.delete('/:id', deleteOffer);
	
module.exports = promoCodeRouter;
