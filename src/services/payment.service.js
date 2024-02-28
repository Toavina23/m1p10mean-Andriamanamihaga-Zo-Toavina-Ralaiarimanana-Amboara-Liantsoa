const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(amount) {
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount,
			currency: "mga",
		});
		return paymentIntent;
	} catch (err) {
		throw err;
	}
}

module.exports = {
    createPaymentIntent
}
