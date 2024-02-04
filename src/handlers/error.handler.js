const { ZodError } = require("zod");
const { AppError } = require("../app_error");

function validationError(err, req, res, next) {
	if (err instanceof ZodError) {
		req.log.error(err);
		err.name = "Bad request";
		res.status(400).json({
			error: "Bad request",
			message: err.issues,
		});
	} else {
		next(err);
	}
}

function otherError(err, req, res, next) {
	console.log(err);
	req.log.error(err);
	res.status(500).json({
		error: "internal server error",
		message: "internal server error",
	});
}

function appError(err, req, res, next) {
	if (err instanceof AppError) {
		req.log.error(err);
		res.status(err.status).json({
			error: err.name,
			message: err.message,
		});
	} else {
		next(err);
	}
}
exports.otherError = otherError;
exports.validationError = validationError;
exports.appError = appError;
