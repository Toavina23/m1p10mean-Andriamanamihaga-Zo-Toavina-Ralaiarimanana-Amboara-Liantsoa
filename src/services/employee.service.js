const { Service } = require("../models/services");
const { Task } = require("../models/task");
const { User } = require("../models/user");

async function findEmployeeForService(serviceId, startDate) {
	const gmtPlus3Offset = 3 * 60 * 60 * 1000;
	const start = new Date(startDate).getTime() + gmtPlus3Offset;
	const { duration } = await Service.findById(serviceId);
	const employees = await User.find({ role: "EMPLOYEE" }).exec();

	const employeesAvailability = employees.map((employee) => ({
		employeeId: employee._id,
		firstname: employee.firstname,
		lastname: employee.lastname,
		availableIn: 0,
	}));

	const tasks = await Task.find({
		service: serviceId,
		$or: [{ startTime: { $lte: start } }],
	})
		.populate("employeeId")
		.exec();
	console.log(tasks);
	tasks.forEach((task) => {
		const taskEndTime = new Date(task.startTime.getTime() + duration * 60000);
		console.log(taskEndTime);
		if (taskEndTime.getTime() > start) {
			const employee = employeesAvailability.find((e) =>
				e.employeeId.equals(task.employeeId._id)
			);
			if (employee) {
				const unavailabilityDuration = Math.round(
					(taskEndTime.getTime() - start) / 60000
				); // in minutes
				employee.availableIn = unavailabilityDuration;
			}
		}
	});
	return employeesAvailability;
}

module.exports = {
	findEmployeeForService,
};
