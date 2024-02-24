const {
	Schema,
	model,
	Types: { ObjectId },
} = require("mongoose");
const { UserSchema } = require("./user");

const EmbededUserSchema = new Schema({
	clientId: { type: ObjectId, required: true },
	email: { type: String, required: true },
	firstname: UserSchema.obj.firstname,
	lastname: UserSchema.obj.lastname,
	role: UserSchema.obj.role,
});

const appointmentSchema = new Schema({
	startDate: { type: Date, required: true },
	client: { type: EmbededUserSchema },
	tasks: { type: [ObjectId], ref: "task", required: true },
	status: { type: Number, default: 0 },
	paymentId: { type: String, required: true },
});

const Appointment = model("appointment", appointmentSchema);
exports.Appointment = Appointment;
