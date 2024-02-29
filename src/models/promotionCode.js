const {
	Schema,
	model,
} = require("mongoose");

const promotionCodeSchema = new Schema({
	endDate: { type: Date, required: true },
	code: { type: String, required: true, unique: true },
	reduction: { type: Number, required: true },
});

const PromotionCode = model('promotionCode',promotionCodeSchema);
exports.PromotionCode = PromotionCode;
