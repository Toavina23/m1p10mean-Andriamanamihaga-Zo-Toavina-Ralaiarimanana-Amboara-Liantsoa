const { AppError } = require("../app_error");
const { PromotionCode } = require("../models/promotionCode");
const PROMO_CODE_TEMPLATE = require("../templates/promo_code_email_template");
const { sendMail } = require("./email.service");
const { User } = require("../models/user");
const { Appointment } = require("../models/appointment");

async function getValidPromotionCode(code, userId) {
	const now = new Date(Date.now() + 3 * 3_600_000);

	const used = await Appointment.find({
		promotionCode: {
			code: code,
		},
		client: {
			clientId: userId,
		},
	});
	if (used) {
		throw new AppError(400, "Bad request", "Vous avez deja utiliser ce code de promotion");
	}
	const promotionCode = await PromotionCode.findOne({
		code: code,
	});
	if (promotionCode) {
		if (promotionCode.endDate.getTime() < now.getTime()) {
			throw new AppError(400, "Bad request", "Ce code de promotion est expiré");
		}
		return promotionCode;
	}
	throw new AppError(400, "Bad request", "Ce code de promotion n'existe");
}

async function findPromotionCodeById(promotionCodeId) {
	try {
		const promotionCode = await PromotionCode.findById(promotionCodeId);
		if (promotionCode) {
			return promotionCode;
		}
		throw new AppError(400, "Bad request", "Ce code de promotion n'existe");
	} catch (err) {
		throw err;
	}
}

async function createPromotionCode(payload) {
	try {
		const offer = await PromotionCode.create(payload);
		return offer;
	} catch (error) {
		throw error;
	}
}

async function sendAllClientsEmail(offer) {
	try {
		const clients = await User.find({ role: "CLIENT", verified: 1 });
		if (clients) {
			clients.forEach((client) => sendEmailPromotionCode(offer, client));
		}
	} catch (error) {
		throw error;
	}
}

async function sendEmailPromotionCode(offer, client) {
	const { code, reduction, endDate } = offer;
	await sendMail(
		{
			from: `Beauty Salon <${process.env.EMAIL_USER}>`,
			to: client.email,
			subject: "Beauty Salon special offer",
			text: code,
			html: PROMO_CODE_TEMPLATE(
				code,
				reduction,
				endDate.toLocaleDateString("fr-FR")
			),
		},
		function (info) {
			console.log(`Special offer email sent.`);
		}
	);
}

module.exports = {
	getValidPromotionCode,
	findPromotionCodeById,
	createPromotionCode,
	sendAllClientsEmail,
};
