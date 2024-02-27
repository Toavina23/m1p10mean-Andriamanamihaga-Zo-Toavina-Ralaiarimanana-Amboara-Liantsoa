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
		let promotionCode = undefined;
		let taskPercentOff = 0;
		if (appointmentPayload.promotionCodeId) {
			promotionCode = await findPromotionCodeById(
				appointmentPayload.promotionCodeId
			);
			taskPercentOff =
				promotionCode.reduction / appointmentPayload.tasks.length;
			console.log(promotionCode);
			console.log(taskPercentOff);
		}
		const tasksIds = [];
		for (let task of appointmentPayload.tasks) {
			const taskId = await saveTask(
				new Date(new Date(task.start).getTime() + 3 * 3_600_000),
				task.serviceId,
				task.employeeId,
				taskPercentOff
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
			amountPaid: appointmentPayload.amountPaid,
			startDate: new Date(
				new Date(appointmentPayload.startDate).getTime() + 3 * 3_600_000
			),
			status: 0,
			tasks: tasksIds,
		});
		if (promotionCode) {
			newAppointment.promotionCode = {
				codeId: promotionCode._id,
				code: promotionCode.code,
				reduction: promotionCode.reduction,
			};
		}
		await newAppointment.save();
	} catch (err) {
		throw err;
	}
}

async function findAppointments(userId, filters) {
	try {
		const { dateTo, dateFrom, status, page, pageSize } = filters;
		const skip = (page - 1) * pageSize;
		const query = {};
		query["client.clientId"] = userId;
		if (dateTo) {
			query["startDate"] = query["startDate"] || {};
			const date = new Date(dateTo).getTime() + 3 * 3_600_000;
			query["startDate"].$lte = date;
		}
		if (dateFrom) {
			query["startDate"] = query["startDate"] || {};
			const date = new Date(dateFrom).getTime() + 3 * 3_600_000;
			query["startDate"].$gte = date;
		}
		if (status) {
			query["status"] = parseInt(status);
		}
		const appointments = await Appointment.find(query)
			.skip()
			.limit(pageSize)
			.exec();
		return appointments;
	} catch (err) {
		throw err;
	}
}
module.exports = {
	saveAppointment,
	findAppointments,
};
