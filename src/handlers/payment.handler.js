const z = require("zod");
const { createPaymentIntent } = require("../services/payment.service");

const paymentIntentSchema = z.object({
	amount: z.number(),
});
async function createAppointmentPaymentIntent(req, res, next) {
	try {
		const body = paymentIntentSchema.parse(req.body);
		const paymentIntent = await createPaymentIntent(body.amount);
		return res.json({
			secret: paymentIntent.client_secret,
		});
	} catch (err) {
		throw err;
	}
}

module.exports = {
	createAppointmentPaymentIntent,
};
