const { AppError } = require("../app_error");
const { PromotionCode } = require("../models/promotionCode");

async function getValidPromotionCode(code) {
	const now = new Date(Date.now() + 3 * 3_600_000);
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
		const offer = await PromotionCode.create(payload)
		return offer
	} catch (error) {
		throw error;
	}
}
module.exports = {
	getPromotionCode: getValidPromotionCode,
	findPromotionCodeById,
	createPromotionCode
};
