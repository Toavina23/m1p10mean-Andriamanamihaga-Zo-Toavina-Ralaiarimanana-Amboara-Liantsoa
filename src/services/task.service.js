const { MongooseError } = require("mongoose");
const { Task } = require("../models/task");
const { getServiceById } = require("./service.service");
const { findUserById } = require("./user.service");

async function saveTask(startTime, serviceId, employeeId, taskPercentOff) {
	try {
		const employee = await findUserById(employeeId);
		const service = await getServiceById(serviceId);
		const servicePrice = service.price * (1 - taskPercentOff / 100);
		let newTask = new Task({
			startTime: startTime,
			service: serviceId,
			employeeId: employeeId,
			servicePrice: servicePrice,
			employeeComission: employee.commission,
		});
		newTask = await newTask.save();
		return newTask._id;
	} catch (err) {
		throw err;
	}
}
async function findTaskDetails(taskId) {
	try {
		const taskDetails = Task.findById(taskId)
			.populate("service", "duration title")
			.populate("employeeId", "firstname fullname");
		return taskDetails;
	} catch (err) {
		throw err;
	}
}
module.exports = {
	saveTask,
	findTaskDetails,
};
