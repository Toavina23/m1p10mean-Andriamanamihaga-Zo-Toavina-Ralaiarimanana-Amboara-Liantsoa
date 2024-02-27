const express = require('express')
const { getEmployeeTasks, getTasks } = require('../handlers/task.handler')

const taskRouter = express.Router()

taskRouter.get('', getTasks)
taskRouter.get('/employees/:id', getEmployeeTasks)

module.exports = taskRouter