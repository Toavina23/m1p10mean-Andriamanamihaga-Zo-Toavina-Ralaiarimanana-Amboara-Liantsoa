const { Schema, model } = require("mongoose");

const emailValidationSchema = new Schema({
	userId: { type: String, required: true },
	expiresAt: { type: Date, required: true },
	code: { type: String, required: true },
});

const EmailValidation = model("EmailValidation", emailValidationSchema);
exports.EmailValidation = EmailValidation;
