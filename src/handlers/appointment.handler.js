const z = require("zod");
const { saveAppointment } = require("../services/appointment.service");

const appointmentSchema = z.object({
	startDate: z.string().refine((value) => {
		return !isNaN(new Date(value).getTime());
	}),
	paymentId: z.string(),
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
});
async function createNewAppointment(req, res, next) {
	try {
		const appointmentPayload = appointmentSchema.parse(req.body);
		await saveAppointment(appointmentPayload);
		res.status(201).json({
			status: "created",
		});
	} catch (err) {
		next(err);
	}
}
module.exports = { createNewAppointment };
