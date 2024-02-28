const {
	Schema,
	model,
	Types: { ObjectId },
} = require("mongoose");

const scheduleSchema = {
	Lundi: {
		startTime: { type: String },
		endTime: { type: String },
	},
	Mardi: {
		startTime: { type: String },
		endTime: { type: String },
	},
	Mercredi: {
		startTime: { type: String },
		endTime: { type: String },
	},
	Jeudi: {
		startTime: { type: String },
		endTime: { type: String },
	},
	Vendredi: {
		startTime: { type: String },
		endTime: { type: String },
	},
	Samedi: {
		startTime: { type: String },
		endTime: { type: String },
	},
	Dimanche: {
		startTime: { type: String },
		endTime: { type: String },
	},
};
const userSchema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	verified: { type: Number, required: true, default: 0 },
	starting_day: { type: Date, required: false },
	commission: { type: Number, required: false },
	role: { type: String, required: true, enum: ["ADMIN", "EMPLOYEE", "CLIENT"] },
	schedule: scheduleSchema,
	preferedServices: { type: [ObjectId], ref: "service", default: [] },
	preferedEmployees: { type: [ObjectId], ref: "user", default: [] },
});

userSchema.statics.findOneOrCreate = function (condition, callback) {
	const self = this;
	self.findOne(condition, (err, result) => {
		return result
			? callback(err, result)
			: self.create(condition, (err, result) => {
					return callback(err, result);
			  });
	});
};

const User = model("user", userSchema);
exports.User = User;
exports.UserSchema = userSchema;
