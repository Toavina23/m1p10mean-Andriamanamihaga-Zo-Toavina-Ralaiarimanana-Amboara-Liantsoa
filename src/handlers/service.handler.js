function fetchServices(req, res, next) {
	try {
        return res.json({
            message: "hello" 
        })
	} catch (err) {
		next(err);
	}
}

module.exports = {
	fetchServices,
};
