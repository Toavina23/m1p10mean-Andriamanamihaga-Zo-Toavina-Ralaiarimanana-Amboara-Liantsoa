const express = require("express");
const {
	getEmployeeTasks,
	getTasks,
	getTaskDetails,
} = require("../handlers/task.handler");

const taskRouter = express.Router();

taskRouter.get("", getTasks);
taskRouter.get("/employees/:id", getEmployeeTasks);
taskRouter.get("/:id", getTaskDetails);

module.exports = taskRouter;
