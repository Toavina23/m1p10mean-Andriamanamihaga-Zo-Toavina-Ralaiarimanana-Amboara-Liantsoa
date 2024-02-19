const { Schema, model } = require("mongoose");

const serviceSchema = new Schema({
    title : {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    duration: {type: Number, required: true},
	email: { type: String, required: true, unique: true },
});

const Service = model("Service", serviceSchema);
exports.Service = Service;