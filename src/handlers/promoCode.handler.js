const { ZodError, ...z } = require("zod");
const { getPromotionCode, createPromotionCode } = require("../services/promotionCode.service");
const { PromotionCode } = require("../models/promotionCode");

const newPromotionCodeSchema = z.object({
	code: z.string(),
	reduction: z.number(),
	endDate: z.coerce.date()
})
const updatePromotionCodeSchema = z.object({
	code: z.string().optional(),
	reduction: z.number().optional(),
	endDate: z.coerce.date().optional()
})

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

async function getOffers(req, res, next) {
	try {
		const offers = await PromotionCode.find()
		res.json(offers)
	} catch (error) {
		next(error)
	}
}

async function findOffer(req, res, next) {
	try {
		const offer = await PromotionCode.findById(req.params.id)
		res.json(offer)
	} catch (error) {
		next(error)
	}
}

async function newOffer(req, res, next) {
	try {
		const newOfferInfo = newPromotionCodeSchema.parse(req.body)
		const newOffer = await createPromotionCode(newOfferInfo)
		res.json({
			offer_id: newOffer._id
		})
	} catch (error) {
		next(error)
	}
}

async function updateOffer(req, res, next) {
	try {
		const updatedOfferInfo = updatePromotionCodeSchema.parse(req.body)
		const updatedOffer = await PromotionCode.updateOne({ _id: req.params.id }, updatedOfferInfo)
		res.json(updatedOffer)
	} catch (error) {
		next(error)
	}
}

async function deleteOffer(req, res, next) {
	try {
		await PromotionCode.deleteOne({ _id: req.params.id })
		res.json({})
	} catch (error) {
		next(error)
	}
}

module.exports = {
	validatePromotionCode,
	newOffer,
	getOffers,
	findOffer,
	updateOffer,
	deleteOffer
};
