const { User } = require("../models/user");
const bcrypt = require("bcrypt");

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

module.exports = {
	findUser,
    saveNewUser
};