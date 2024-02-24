const { AppError } = require("../app_error");
const { Appointment } = require("../models/appointment");
const { User } = require("../models/user");
const { saveTask } = require("./task.service");
const userService = require("./user.service");

async function saveAppointment(appointmentPayload) {
	try {
		const client = await userService.findUserById(appointmentPayload.userId);
		if (!client) {
			throw new AppError("client not found");
		}
		const tasksIds = [];
		for (task of appointmentPayload.tasks) {
			const taskId = await saveTask(
				task.start,
				task.serviceId,
				task.employeeId
			);
			tasksIds.push(taskId);
		}
		const newAppointment = new Appointment({
			client: {
				clientId: client._id,
				email: client.email,
				firstname: client.firstname,
				lastname: client.lastname,
				role: client.role,
			},
			paymentId: appointmentPayload.paymentId,
			startDate: new Date(appointmentPayload.startDate + 3 * 3_600_000),
			status: 0,
			tasks: tasksIds,
		});
		await newAppointment.save();
	} catch (err) {
		throw err;
	}
}
module.exports = {
	saveAppointment,
};
