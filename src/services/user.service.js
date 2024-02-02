const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function findUser(email, password, role) {
	const user = await User.findOne({
		email: email,
		role: role,
	});
	if (user && bcrypt.compareSync(password, user.password)) {
		return user;
	}
	return null;
}

async function saveNewUser(userInfo) {
	const hashedPassword = await hashUserPassword(userInfo.password);
	const newUser = new User({ ...userInfo, password: hashedPassword });
	await newUser.save();
	return newUser;
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

module.exports = {
	findUser,
	saveNewUser,
	generateUserToken,
};
