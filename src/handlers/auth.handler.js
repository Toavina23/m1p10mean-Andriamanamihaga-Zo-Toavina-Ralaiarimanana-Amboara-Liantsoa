const z = require("zod");
const {
	findUser,
	saveNewUser,
	generateUserToken,
	checkValidationCode,
	findUserById,
	sendNewValidationCode,
} = require("../services/user.service");
const { AppError } = require("../app_error");
const { User } = require("../models/user");

const registrationInfoSchema = z.object({
	email: z.string().min(1).email(),
	password: z.string().min(8),
	role: z.enum(["ADMIN", "EMPLOYEE", "CLIENT"]),
	firstname: z.string().min(1),
	lastname: z.string(),
});
async function register(req, res, next) {
	try {
		const newUserInfo = registrationInfoSchema.parse(req.body);
		const newUser = await saveNewUser(newUserInfo);
		res.status(201).json({
			userId: newUser._id,
		});
	} catch (err) {
		next(err);
	}
}

const resendCodeValidationShema = z.object({
	userId: z.string().min(1),
});
async function resendValidationCode(req, res, next) {
	try {
		console.log(req.body);
		const { userId } = resendCodeValidationShema.parse(req.body);
		sendNewValidationCode(userId);
		res.status(200).json({
			message: "ok",
		});
	} catch (err) {
		next(err);
	}
}

const emailValidationSchema = z.object({
	code: z.string().length(6),
	userId: z.string().min(1),
});
async function confirmUserEmail(req, res, next) {
	try {
		const { code, userId } = emailValidationSchema.parse(req.body);
		const codeValid = checkValidationCode(code, userId);
		if (codeValid) {
			const user = await findUserById(userId);
			await User.updateOne({ _id: user._id }, { verified: 1 });
			const token = generateUserToken(user);
			res.status(200).json({
				username: `${user.firstname} ${user.lastname}`,
				token: token,
			});
		} else {
			throw new AppError(401, "Not authorized", "Code de validation invalide");
		}
	} catch (e) {
		next(e);
	}
}

const authenticationSchema = z.object({
	email: z.string().min(1).email(),
	password: z.string().min(8),
	role: z.enum(["ADMIN", "EMPLOYEE", "CLIENT"]),
});
async function authenticate(req, res, next) {
	try {
		const authenticationInfo = authenticationSchema.parse(req.body);
		const user = await findUser(
			authenticationInfo.email,
			authenticationInfo.password,
			authenticationInfo.role
		);
		if (!user) {
			throw new AppError(
				401,
				"Not authorized",
				"Could not find user with those credentials"
			);
		}
		if (user.verified === 0) {
			throw new AppError(401, "Not authorized", "Email non vérifié");
		}
		const token = generateUserToken(user);
		res.status(200).json({
			username: `${user.firstname} ${user.lastname}`,
			token: token,
		});
	} catch (err) {
		next(err);
	}
}

module.exports = {
	register,
	authenticate,
	confirmUserEmail,
	resendValidationCode,
};
