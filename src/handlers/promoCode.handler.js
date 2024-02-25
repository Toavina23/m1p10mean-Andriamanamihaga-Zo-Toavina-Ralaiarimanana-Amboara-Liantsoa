const { ZodError } = require("zod");
const { getPromotionCode } = require("../services/promotionCode.service");

async function validatePromotionCode(req, res, next) {
	try {
		const code = req.params.code;
		if (!code) {
			throw new ZodError([
				{
					message: "code required",
				},
			]);
		}
		const promotionCode = await getPromotionCode(code);
		res.json({
			reduction: promotionCode.reduction,
			id: promotionCode._id,
		});
	} catch (error) {
		next(error);
	}
}

module.exports = {
	validatePromotionCode,
};
