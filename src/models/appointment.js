const {
	Schema,
	model,
	Types: { ObjectId },
} = require("mongoose");
const { UserSchema } = require("./user");

const EmbededUserSchema = new Schema({
	clientId: { type: ObjectId, ref: "user", required: true },
	email: { type: String, required: true },
	firstname: UserSchema.obj.firstname,
	lastname: UserSchema.obj.lastname,
	role: UserSchema.obj.role,
});
const promotionCodeSchema = new Schema({
	codeId: { type: ObjectId, ref: "promotionCode", required: true },
	code: { type: String, required: true },
	reduction: { type: Number, required: true },
});
const appointmentSchema = new Schema({
	bookingDate: { type: Date, required: false, default: () => Date.now() },
	startDate: { type: Date, required: true },
	client: { type: EmbededUserSchema },
	tasks: { type: [ObjectId], ref: "task", required: true },
	status: { type: Number, default: 0 },
	paymentId: { type: String, required: true },
	amountPaid: { type: Number, required: true },
	promotionCode: { type: promotionCodeSchema, required: false },
});

const Appointment = model("appointment", appointmentSchema);
exports.Appointment = Appointment;
