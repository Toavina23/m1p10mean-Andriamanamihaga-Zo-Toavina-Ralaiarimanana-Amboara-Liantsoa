const z = require("zod");
const { User } = require("../models/user");

const registrationInfoSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(8),
	fullname: z.string().min(1),
});
async function register(req, res, next) {
	try {
		const newUserInfo = registrationInfoSchema.parse(req.body);
		const newUser = new User(newUserInfo);
		await newUser.save();
		req.log.info("User registered");
		res.status(201).json(newUser);
	} catch (err) {
		next(err);
	}
}

module.exports = {
	register,
};
