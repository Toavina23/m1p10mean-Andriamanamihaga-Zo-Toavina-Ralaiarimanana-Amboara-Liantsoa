const z = require("zod");
const { Task } = require("../models/task");
const { findTaskDetails } = require("../services/task.service");
const { AppError } = require("../app_error");

async function getTasks(req, res, next) {
	try {
		const tasks = await Task.find().populate(["service", "employeeId"]);
		res.json(tasks);
	} catch (err) {
		next(err);
	}
}
async function getEmployeeTasks(req, res, next) {
	try {
		const tasks = await Task.find({
			employeeId: { $eq: req.params.id },
		}).populate(["service", "employeeId"]);
		res.json(tasks);
	} catch (err) {
		next(err);
	}
}
const taskDetailsSchema = z.string().min(1);
async function getTaskDetails(req, res, next) {
	try {
		const taskId = taskDetailsSchema.parse(req.path.id);
		const taskDetails = await findTaskDetails(taskId);
		if (!taskDetails) {
			throw new AppError(400, "Bad request", "Tache non trouvé");
		}
		return taskDetails;
	} catch (err) {
		next(err);
	}
}
module.exports = {
	getTasks,
	getEmployeeTasks,
	getTaskDetails,
};
