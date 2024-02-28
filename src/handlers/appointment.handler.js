const z = require("zod");
const {
	saveAppointment,
	findAppointments,
} = require("../services/appointment.service");

const appointmentSchema = z.object({
	startDate: z.coerce.date(),
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
	promotionCodeId: z.union([z.undefined(), z.string()]),
});
async function createNewAppointment(req, res, next) {
	try {
		const userId = req.user.id;
		const appointmentPayload = appointmentSchema.parse(req.body);
		console.log(appointmentPayload);
		appointmentPayload["userId"] = userId;
		await saveAppointment(appointmentPayload);
		res.status(201).json({
			status: "created",
		});
	} catch (err) {
		next(err);
	}
}

const userAppointmentSchema = z.object({
	dateFrom: z.union([
		z.undefined(),
		z.string().refine((value) => {
			return !isNaN(new Date(value).getTime());
		}),
	]),
	dateTo: z.union([
		z.undefined(),
		z.string().refine((value) => {
			return !isNaN(new Date(value).getTime());
		}),
	]),
	status: z.union([z.undefined(), z.string()]),
	page: z.union([z.undefined(), z.string()]),
	pageSize: z.union([z.undefined(), z.string()]),
});

async function getUserAppointments(req, res, next) {
	try {
		const userId = req.user.id;
		const filters = userAppointmentSchema.parse(req.query);
		if (filters.page == undefined) {
			filters.page = 1;
		}
		if (filters.pageSize == undefined) {
			filters.pageSize = 10;
		}
		const { appointments, totalCount } = await findAppointments(
			userId,
			filters
		);
		return res.json({
			data: appointments,
			totalCount: totalCount,
		});
	} catch (error) {
		next(error);
	}
}
module.exports = { createNewAppointment, getUserAppointments };
