const { Task } = require("../models/task");
const { getServiceById } = require("./service.service");
const { findUserById } = require("./user.service");

async function saveTask(startTime, serviceId, employeeId) {
	try {
		const employee = await findUserById(employeeId);
		const service = await getServiceById(serviceId);
		let newTask = new Task({
			startTime: startTime,
			service: serviceId,
			employeeId: employeeId,
			servicePrice: service.price,
			employeeComission: employee.commission,
		});
		newTask = await newTask.save();
		return newTask._id;
	} catch (err) {
		throw err;
	}
}

module.exports = {
	saveTask,
};
