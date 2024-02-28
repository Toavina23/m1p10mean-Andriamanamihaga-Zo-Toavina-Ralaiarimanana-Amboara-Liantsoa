const { User } = require("../../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const PASSWORD_HASH_SALT_ROUND = 8;
mongoose.connect(process.env.DB_URL);
bcrypt
	.hash("Beauty21Salon", PASSWORD_HASH_SALT_ROUND)
	.then(async (hashedPassword) => {
		const userData = {
			firstname: "Beauty",
			lastname: "Salon",
			email: "beauty@salon.com",
			password: hashedPassword,
			role: "ADMIN",
			verified: 1,
		};
		const user = await User.findOne({ email: userData.email });
		if (user) {
			console.log("Manager is up to date.");
		} else {
			await User.create(userData);
			console.log("Manager created successfully.");
		}
	});
