const {
	addServiceToUserPreferences,
	removeServiceFromUserPreferences,
	fetchPreferedService,
} = require("../services/service.service");
const z = require("zod");

const preferedServiceSchema = z.object({
	serviceId: z.string().min(1),
});
async function setToPreferedService(req, res, next) {
	try {
		const user = req.user;
		const params = preferedServiceSchema.parse(req.body);
		await addServiceToUserPreferences(params.serviceId, user.id);
		return res.status(201).json({});
	} catch (err) {
		next(err);
	}
}

const removePreferedServiceSchema = z.object({
	serviceId: z.string().min(1),
});

async function removeFromPreferedService(req, res, next) {
	try {
		const user = req.user;
		const params = removePreferedServiceSchema.parse(req.body);
		await removeServiceFromUserPreferences(params.serviceId, user.id);
		return res.status(200).json({});
	} catch (err) {
		next(err);
	}
}

async function getUserPreferedServices(req, res, next) {
	try {
		const user = req.user;
		const services = await fetchPreferedService(user.id);
		return res.status(200).json(services);
	} catch (err) {
		next(err);
	}
}
module.exports = {
	setToPreferedService,
	removeFromPreferedService,
	getUserPreferedServices,
};
