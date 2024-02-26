const {
	Schema,
	model,
	Types: { ObjectId },
} = require("mongoose");

const TaskSchema = new Schema({
	startTime: {
		type: Date,
		required: true,
	},
	service: {
		type: ObjectId,
		ref: "service",
		required: true,
	},
	employeeId: {
		type: ObjectId,
		ref: "user",
		required: true,
	},
	servicePrice: {type: Number, required: true},
	employeeComission: {type: Number, required: true}
});

const Task = model("task", TaskSchema);
exports.Task = Task;
