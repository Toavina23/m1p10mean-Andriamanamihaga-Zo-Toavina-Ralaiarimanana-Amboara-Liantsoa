const { Service } = require("../models/services");

async function getServiceById(serviceId) {
	const service = await Service.findById(serviceId);
	if (service) {
		return service;
	}
	throw new Error("Service not found");
}
module.exports = {
	getServiceById,
};
