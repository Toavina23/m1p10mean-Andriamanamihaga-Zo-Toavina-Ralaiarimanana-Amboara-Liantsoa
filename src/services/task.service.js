const { Task } = require("../models/task");

async function saveTask(startTime, serviceId, employeeId) {
	try {
		let newTask = new Task({
			startTime: startTime,
			service: serviceId,
			employeeId: employeeId,
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
