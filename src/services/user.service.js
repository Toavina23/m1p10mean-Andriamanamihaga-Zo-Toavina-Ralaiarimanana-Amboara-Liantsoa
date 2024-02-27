const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { EmailValidation } = require("../models/email-validation");
const { AppError } = require("../app_error");
const mongoose = require("mongoose");
const VALIDATION_CODE_TEMPLATE = require("../templates/validation_code_email_template");
const { sendMail } = require("../services/email.service");

async function findUser(authPayload) {
	const { email, password } = authPayload;
	const user = await User.findOne({ email });
	if (user && bcrypt.compareSync(password, user.password)) {
		return user;
	}
	return null;
}

const CODE_HASH_SALT_ROUND = 5;
async function checkValidationCode(code, userId) {
	const emailValidation = await EmailValidation.findOne({
		userId: userId,
	})
		.where("expiresAt")
		.gte(new Date().getTime());
	if (emailValidation && bcrypt.compareSync(code, emailValidation.code)) {
		await EmailValidation.deleteOne({
			_id: emailValidation._id,
		});
		return true;
	}
	return false;
}

async function generateValidationCode(id) {
	const codeEpirationDate = new Date().getTime() + 10 * 60 * 1000;
	const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
	const hashedCode = await bcrypt.hash(randomCode, CODE_HASH_SALT_ROUND);
	const emailValidation = new EmailValidation({
		expiresAt: codeEpirationDate,
		userId: id,
		code: hashedCode,
	});
	await EmailValidation.deleteMany({
		userId: id,
	});
	emailValidation.save();
	return randomCode;
}

async function sendNewValidationCode(userId) {
	const user = await findUserById(userId);
	if (!user) {
		throw new AppError(400, "Bad Request", "Utilisateur inconnu");
	}
	const code = await generateValidationCode(user._id);
	await sendEmailValidationCode(code, user);
}
async function saveNewUser(userInfo) {
	try {
		const hashedPassword = await hashUserPassword(userInfo.password);
		const newUser = new User({ ...userInfo, password: hashedPassword });
		const session = await mongoose.startSession();
		session.startTransaction();
		await newUser.save();
		const code = await generateValidationCode(newUser._id);
		await sendEmailValidationCode(code, newUser);
		await session.commitTransaction();
		await session.endSession();
		return newUser;
	} catch (err) {
		// checks for mongo duplicaton error code
		if (err.code == 11000) {
			throw new AppError(400, "Bad Request", "Email déja utilisé");
		} else {
			throw err;
		}
	}
}
async function sendEmailValidationCode(code, newUser) {
	await sendMail(
		{
			from: `Beauty Salon <${process.env.EMAIL_USER}>`,
			to: newUser.email,
			subject: "Beauty Salon email validation code",
			text: code,
			html: VALIDATION_CODE_TEMPLATE(code),
		},
		function (info) {
			console.log(`Validation code email sent, messageId:${info.messageId}`);
		}
	);
}

const PASSWORD_HASH_SALT_ROUND = 8;

async function hashUserPassword(password) {
	try {
		const passwordHash = await bcrypt.hash(password, PASSWORD_HASH_SALT_ROUND);
		return passwordHash;
	} catch (e) {
		throw e;
	}
}

const TOKEN_DURATION = 3600;
function generateUserToken(user) {
	const token = jwt.sign(
		{
			userId: user._id,
			email: user.email,
			role: user.role,
			exp: Math.floor(Date.now() / 1000 + TOKEN_DURATION),
		},
		process.env.JWT_SECRET_KEY
	);
	return token;
}

async function findUserById(userId) {
	const user = await User.findOne({
		_id: userId,
	});
	return user;
}

module.exports = {
	findUser,
	saveNewUser,
	generateUserToken,
	generateValidationCode,
	checkValidationCode,
	findUserById,
	sendNewValidationCode,
};
