const { AppError } = require("../app_error");
const { Appointment } = require("../models/appointment");
const { saveTask } = require("./task.service");
const userService = require("./user.service");
const { findPromotionCodeById } = require("./promotionCode.service");

async function saveAppointment(appointmentPayload) {
	try {
		const client = await userService.findUserById(appointmentPayload.userId);
		if (!client) {
			throw new AppError("client not found");
		}
		const tasksIds = [];
		for (task of appointmentPayload.tasks) {
			const taskId = await saveTask(
				new Date(new Date(task.start).getTime() + 3 * 3_600_000),
				task.serviceId,
				task.employeeId
			);
			tasksIds.push(taskId);
		}
		const promotionCode = await findPromotionCodeById(
			appointmentPayload.promotionCodeId
		);
		const newAppointment = new Appointment({
			client: {
				clientId: client._id,
				email: client.email,
				firstname: client.firstname,
				lastname: client.lastname,
				role: client.role,
			},
			paymentId: appointmentPayload.paymentId,
			amountPaid: appointmentPayload.amountPaid,
			startDate: new Date(
				new Date(appointmentPayload.startDate).getTime() + 3 * 3_600_000
			),
			status: 0,
			tasks: tasksIds,
			promotionCode: {
				codeId: promotionCode._id,
				code: promotionCode.code,
				reduction: promotionCode.reduction,
			},
		});
		await newAppointment.save();
	} catch (err) {
		throw err;
	}
}
module.exports = {
	saveAppointment,
};
