const express = require("express");
const {
	setToPreferedService,
	removeFromPreferedService,
	getUserPreferedServices,
	getUserPreferedEmployees,
	setToPreferedEmployee,
	removeFromPreferedEmployee,
} = require("../handlers/preferences.handler");
const { isAuthenticated, isCustomer } = require("../auth-middleware");

const preferencesRouter = express.Router();
preferencesRouter.post(
	"/services",
	isAuthenticated,
	setToPreferedService
);
preferencesRouter.delete(
	"/services",
	isAuthenticated,
	removeFromPreferedService
);
preferencesRouter.get(
	"/services",
	isAuthenticated,
	getUserPreferedServices
);
preferencesRouter.post(
	"/employees",
	isAuthenticated,
	setToPreferedEmployee
);
preferencesRouter.delete(
	"/employees",
	isAuthenticated,
	removeFromPreferedEmployee
);
preferencesRouter.get(
	"/employees",
	isAuthenticated,
	getUserPreferedEmployees
);
module.exports = preferencesRouter;
