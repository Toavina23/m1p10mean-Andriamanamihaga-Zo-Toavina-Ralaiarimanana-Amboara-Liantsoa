const { Task } = require('../models/task')

async function getTasks (req, res, next) {
    try {
        const tasks = await Task.find().populate(['service', 'employeeId'])
        res.json(tasks)
    } catch(err) {
        next(err)
    }
}
async function getEmployeeTasks(req, res, next) {
    try {
        const tasks = await Task.find({ employeeId: { $eq: req.params.id } }).populate(['service', 'employeeId'])
        res.json(tasks)
    } catch(err) {
        next(err)
    }
}

module.exports = {
    getTasks,
    getEmployeeTasks
}