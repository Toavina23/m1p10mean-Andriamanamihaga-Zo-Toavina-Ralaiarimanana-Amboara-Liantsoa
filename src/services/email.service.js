const nodemailer = require("nodemailer");
const { AppError } = require("../app_error");

const transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

async function sendMail(mailDetails, callback) {
	try {
		const result = await transporter.sendMail(mailDetails);
		callback(result);
	} catch (e) {
		console.log(e);
		throw new AppError(
			500,
			"Internal Server Error",
			"Une erreur s'est produite pendant le traitement de votre requête"
		);
	}
}

module.exports = {
	sendMail,
};
