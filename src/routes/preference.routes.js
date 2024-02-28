const express = require("express");
const {
	setToPreferedService,
	removeFromPreferedService,
	getUserPreferedServices,
} = require("../handlers/preferences.handler");
const { isAuthenticated, isCustomer } = require("../auth-middleware");

const preferencesRouter = express.Router();
preferencesRouter.post(
	"/services",
	isAuthenticated,
	isCustomer,
	setToPreferedService
);
preferencesRouter.delete(
	"/services",
	isAuthenticated,
	isCustomer,
	removeFromPreferedService
);
preferencesRouter.get(
	"/services",
	isAuthenticated,
	isCustomer,
	getUserPreferedServices
);
module.exports = preferencesRouter;
