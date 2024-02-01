class AppError extends Error {
	constructor(status, name, message) {
		this.status = status;
		super(message);
		this.name = name;
	}
}
exports.AppError = AppError;
