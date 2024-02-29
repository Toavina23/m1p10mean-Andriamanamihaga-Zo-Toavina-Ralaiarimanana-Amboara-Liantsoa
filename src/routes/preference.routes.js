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
preferencesRouter.post(
	"/employees",
	isAuthenticated,
	isCustomer,
	setToPreferedEmployee
);
preferencesRouter.delete(
	"/employees",
	isAuthenticated,
	isCustomer,
	removeFromPreferedEmployee
);
preferencesRouter.get(
	"/employees",
	isAuthenticated,
	isCustomer,
	getUserPreferedEmployees
);
module.exports = preferencesRouter;
