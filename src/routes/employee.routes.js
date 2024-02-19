const express = require("express");
const { newEmployee, getEmployees, updateEmployee, deleteEmployee, findEmployee } = require("../handlers/employee.handler");

const employeeRouter = express.Router();

employeeRouter.get("", getEmployees);
employeeRouter.get("/:id", findEmployee);
employeeRouter.post("", newEmployee);
employeeRouter.put("/:id", updateEmployee);
employeeRouter.delete("/:id", deleteEmployee);

module.exports = employeeRouter;