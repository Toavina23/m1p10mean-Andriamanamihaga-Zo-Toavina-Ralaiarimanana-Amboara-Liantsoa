const z = require('zod')
const { User } = require('../models/user')
const { saveNewUser } = require('../services/user.service')

const dayScheduleSchema = z.object({
    startTime: z.string().refine(time => isValidTimeFormat(time), {
        message: 'Invalid time format. Please use the hh:mm format.',
        path: ['startTime']
    }),
    endTime: z.string().refine(time => isValidTimeFormat(time), {
        message: 'Invalid time format. Please use the hh:mm format.',
        path: ['startTime']
    })
})
const scheduleSchema = z.object({
    Lundi: dayScheduleSchema.optional(),
    Mardi: dayScheduleSchema.optional(),
    Mercredi: dayScheduleSchema.optional(),
    Jeudi: dayScheduleSchema.optional(),
    Vendredi: dayScheduleSchema.optional(),
    Samedi: dayScheduleSchema.optional(),
    Dimanche: dayScheduleSchema.optional()
})
const employeeInfoSchema = z.object({
	firstname: z.string().min(1),
	lastname: z.string(),
	email: z.string().min(1).email(),
	password: z.string().min(8),
	password_confirmation: z.string().min(8),
    starting_day: z.coerce.date(),
    commission: z.number().min(0).max(100),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
})
async function newEmployee(req, res, next) {
    try {
		const newEmployeeInfo = employeeInfoSchema.parse(req.body)
		const newEmployee = await saveNewUser({...newEmployeeInfo, ['role']: 'EMPLOYEE', ['verified']: 1 })
		res.status(201).json({
			employeeId: newEmployee._id,
		});
	} catch (err) {
		next(err);
	}
}

async function getEmployees(req, res, next) {
    try {
        const employees = await User.find({ role: { $eq: 'EMPLOYEE' } }).select('-password')
        res.json(employees)
    } catch (err) {
        next(err)
    }
}

async function findEmployee(req, res, next) {
    try {
        const employee = await User.findById(req.params.id).select('-password')
        res.json(employee)
    } catch(err) {
        next(err)
    }
}

async function updateEmployee(req, res, next) {
    try {
        const updatesInfo = employeeInfoSchema.parse(req.body)
        const updatedEmployee =  await User.updateOne({ _id: { $eq: req.params.id }}, updatesInfo)
        res.json(updatedEmployee)
    } catch (err) {
        next(err)
    }
}

async function deleteEmployee(req, res, next) {
    try {
        await User.deleteOne({ _id: { $eq: req.params.id }})
        res.json({})
    } catch(err) {
        next(err)
    }
}

async function updateSchedule(req, res, next) {
    try {
        const newScheduleInfo = scheduleSchema.parse(req.body)
        await User.findByIdAndUpdate(req.params.id, { schedule: newScheduleInfo })
        res.json({})
    } catch(err) {
        next(err)
    }
}

function isValidTimeFormat(time) {
    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
}

module.exports = {
    newEmployee,
    getEmployees,
    findEmployee,
    updateEmployee,
    deleteEmployee,
    updateSchedule
}