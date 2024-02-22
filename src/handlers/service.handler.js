const z = require("zod");
const { findEmployeeForService } = require("../services/employee.service");
const { Service } = require("../models/services");

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

const employeeAvailabilitySchema = z.object({
	startDate: z.string().refine((value) => {
		return !isNaN(new Date(value).getTime());
	}),
});

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

module.exports = {
	fetchServices,
	getEmployeeAvailableForService,
};
