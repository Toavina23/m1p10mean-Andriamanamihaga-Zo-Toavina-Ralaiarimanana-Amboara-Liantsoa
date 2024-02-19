const mongoose = require("mongoose");
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

module.exports = {
	fetchServices,
};
