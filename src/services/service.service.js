const { Service } = require("../models/services");
const { User } = require("../models/user");

async function getServiceById(serviceId) {
	const service = await Service.findById(serviceId);
	if (service) {
		return service;
	}
	throw new Error("Service not found");
}

async function addServiceToUserPreferences(serviceId, userId) {
	await getServiceById(serviceId);
	await User.findByIdAndUpdate(
		{ _id: userId, preferedServices: { $ne: serviceId } },
		{
			$addToSet: { preferedServices: serviceId },
		},
		{ new: true }
	);
}
async function removeServiceFromUserPreferences(serviceId, userId) {
	await getServiceById(serviceId);
	await User.findByIdAndUpdate(userId, {
		$pull: { preferedServices: serviceId },
	});
}

async function fetchPreferedService(userId) {
	const services = await User.findById(userId)
		.populate({
			path: "preferedServices",
			select: "_id title",
		})
		.select('preferedServices -_id');
	console.log(services)
	return services;
}
module.exports = {
	getServiceById,
	addServiceToUserPreferences,
	removeServiceFromUserPreferences,
	fetchPreferedService,
};
