const jsonwebtoken = require("jsonwebtoken");
const { AppError } = require("./app_error");
const { findUserById } = require("./services/user.service");

async function isAuthenticated(req, res, next) {
	try {
		if (!req.headers["authorization"]) {
			throw new AppError(401, "Unauthorized", "Token required");
		}
		const token = req.headers["authorization"].split("Bearer ")[1];
		if (!token) {
			throw new AppError(401, "Unauthorized", "Token invalid");
		}
		let decodedToken = undefined;
		try {
			decodedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY);
		} catch (err) {
			if (err instanceof jsonwebtoken.TokenExpiredError) {
				throw new AppError(401, "Unauthorized", "Token expired");
			} else {
				throw err;
			}
		}
		const user = await findUserById(decodedToken.userId);
		req.user = user;
		next();
	} catch (err) {
		next(err);
	}
}

function isCustomer(req, res, next) {
	try {
		const user = req.user;
		if (user.role == "CLIENT") {
			return next();
		}
		throw new AppError(403, "Forbiden", "The user can't access this ressource");
	} catch (err) {
		next(err);
	}
}
function isEmployee(req, res, next) {
	try {
		const user = req.user;
		if (user.role == "EMPLOYEE") {
			return next();
		}
		throw new AppError(403, "Forbiden", "The user can't access this ressource");
	} catch (err) {
		next(err);
	}
}
function isManager(req, res, next) {
	try {
		const user = req.user;
		if (user.role == "MANAGER") {
			return next();
		}
		throw new AppError(403, "Forbiden", "The user can't access this ressource");
	} catch (err) {
		next(err);
	}
}

module.exports = {
	isAuthenticated,
	isEmployee,
	isCustomer,
	isManager,
};
