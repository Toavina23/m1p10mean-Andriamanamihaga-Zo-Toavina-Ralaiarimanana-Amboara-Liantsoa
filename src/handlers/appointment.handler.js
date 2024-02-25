const z = require("zod");
const { saveAppointment } = require("../services/appointment.service");

const appointmentSchema = z.object({
	startDate: z.string().refine((value) => {
		return !isNaN(new Date(value).getTime());
	}),
	paymentId: z.string(),
	amountPaid: z.number(),
	tasks: z.array(
		z.object({
			start: z.string().refine((value) => {
				return !isNaN(new Date(value).getTime());
			}),
			serviceId: z.string(),
			employeeId: z.string(),
		})
	),
	userId: z.string(),
	promotionCodeId: z.union([z.undefined(), z.string()]),
});
async function createNewAppointment(req, res, next) {
	try {
		const appointmentPayload = appointmentSchema.parse(req.body);
		console.log(appointmentPayload);
		await saveAppointment(appointmentPayload);
		res.status(201).json({
			status: "created",
		});
	} catch (err) {
		next(err);
	}
}
module.exports = { createNewAppointment };
