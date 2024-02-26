const z = require("zod");
const { findEmployeeForService } = require("../services/employee.service");
const { Service } = require("../models/services");

const employeeAvailabilitySchema = z.object({
	startDate: z.string().refine((value) => {
		return !isNaN(new Date(value).getTime());
	}),
});
const newServiceSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0), 
    duration: z.number().min(1),
    employees: z.array().optional(),
})
const updateServiceSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    duration: z.number().min(1).optional(),
    employees: z.array().optional().optional(),
})

async function fetchServices(req, res, next) {
	try {
		const services = await Service.find({}).select([
			"title",
			"description",
			"duration",
			"price",
		]);
		return res.json({
			services: services,
		});
	} catch (err) {
		next(err);
	}
}
async function getEmployeeAvailableForService(req, res, next) {
	try {
		const query = employeeAvailabilitySchema.parse(req.query);
		const serviceId = req.params.serviceId;
		const availabilities = await findEmployeeForService(serviceId, query.startDate);
		return res.json(availabilities);
	} catch (err) {
		console.log(err);
		next(err);
	}
}
async function newService(req, res, next) {
    try {
        const newServiceInfo = newServiceSchema.parse(req.body)
        const newService = await Service.create(newServiceInfo)
        res.status(201).json({
            service_id: newService._id
        })
    } catch(err) {
        next(err)
    }
}
async function findService(req, res, next) {
    try {
        const service = await Service.findById(req.params.id)
        res.json(service)
    } catch(err) {
        next(err)
    }
}
async function updateService(req, res, next) {
    try {
        const updatesInfo = updateServiceSchema.parse(req.body)
        const updatedService =  await Service.updateOne({ _id: { $eq: req.params.id }}, updatesInfo)
        res.json(updatedService)
    } catch (err) {
        next(err)
    }
}
async function deleteService(req, res, next) {
    try {
        await Service.deleteOne({ _id: { $eq: req.params.id }})
        res.json({})
    } catch(err) {
        next(err)
    }
}

module.exports = {
	fetchServices,
	getEmployeeAvailableForService,
	newService,
	findService,
	updateService,
	deleteService
};
