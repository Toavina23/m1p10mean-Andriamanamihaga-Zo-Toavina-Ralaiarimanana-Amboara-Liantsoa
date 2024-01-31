const { ZodError } = require("zod");

function validationError(err, req, res, next) {
	if (err instanceof ZodError) {
		req.log.error(err);
		err.name = "Bad request";
		res.status(400).json({
			error: "Bad request",
			messages: err.issues,
		});
	} else {
		next(err);
	}
}

function otherError(err, req, res, next) {
	req.log.error(err);
	res.status(500).json({
		"Error Message": "Internal server error",
	});
}

exports.otherError = otherError;
exports.validationError = validationError;
