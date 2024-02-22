const { Schema, model } = require("mongoose");
const { UserSchema } = require("./user");
const { Task } = require("./task");

const EmbededUserSchema = new Schema({
	email: UserSchema.obj.email,
	firstname: UserSchema.obj.firstname,
	lastname: UserSchema.obj.lastname,
	role: UserSchema.obj.role,
});

const appointmentSchema = new Schema({
	startDate: { type: Date, required: true },
	client: { type: EmbededUserSchema },
	tasks: { type: [Task], required: true },
	status: { type: Number, default: 0 },
});

const Appointment = model("appointment", appointmentSchema);
exports.Appointment = Appointment;
