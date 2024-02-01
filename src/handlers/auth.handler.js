const z = require("zod");
const { findUser, saveNewUser } = require("../services/user.service");
const { AppError } = require("../app_error");
const jwt = require("jsonwebtoken");

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
		res.status(201).json(newUser._id);
	} catch (err) {
		next(err);
	}
}
const TOKEN_DURATION = 3600;
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
		const token = jwt.sign(
			{
				userId: user._id,
				email: user.email,
				role: user.role,
				exp: Math.floor(Date.now() / 1000 + TOKEN_DURATION),
			},
			process.env.JWT_SECRET_KEY
		);
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
};
