const z = require("zod");
const {
	findUser,
	saveNewUser,
	generateUserToken,
} = require("../services/user.service");
const { AppError } = require("../app_error");

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
		const token = generateUserToken(newUser);
		res.status(201).json({
			token: token,
			username: `${newUser.firstname} ${newUser.lastname}`,
		});
	} catch (err) {
		next(err);
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
};
