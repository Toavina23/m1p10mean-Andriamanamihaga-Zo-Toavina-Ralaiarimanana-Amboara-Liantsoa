const { Service } = require("../models/services");
const { Task } = require("../models/task");
const { User } = require("../models/user");

const DAY_OF_WEEK = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

async function findEmployeeForService(serviceId, startDate) {
	const gmtPlus3Offset = 3 * 60 * 60 * 1000;
	const start = new Date(startDate).getTime() + gmtPlus3Offset;
	const { duration, employees } = await Service.findById(serviceId).populate('employees');

	var employeesAvailability = employees.filter((employee) => {
		const day = DAY_OF_WEEK[new Date(startDate).getDay()]
		if(employee.schedule[day] && employee.schedule[day]['startTime'] && employee.schedule[day]['endTime']) {
			const { startTime, endTime } = employee.schedule[day]
			const [ startHour, startMinute ] = startTime.split(':')
			const [ endHour, endMinute ] = endTime.split(':')
			var startDay = new Date(startDate)
			var endDay = new Date(startDate)
			startDay.setHours(parseInt(startHour), parseInt(startMinute))
			endDay.setHours(parseInt(endHour), parseInt(endMinute))
			startDay = startDay.getTime() + gmtPlus3Offset
			endDay = endDay.getTime() + gmtPlus3Offset
			if(start < startDay || start > endDay) console.log('----------TSY ANATY HORAIRE-----------')
			return start >= startDay && start <= endDay
		}
		return false
	});

	employeesAvailability = employeesAvailability.map((employee) => ({
		employeeId: employee._id,
		firstname: employee.firstname,
		lastname: employee.lastname,
		schedule: employee.schedule,
		availableIn: 0,
	}));

	const tasks = await Task.find({
		service: serviceId,
		$or: [{ startTime: { $lte: start } }],
	})
		.populate("employeeId")
		.exec();
	// console.log(tasks);
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
