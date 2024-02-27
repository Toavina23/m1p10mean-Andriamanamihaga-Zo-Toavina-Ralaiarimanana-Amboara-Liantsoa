const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	verified: { type: Number, required: true, default: 0 },
	starting_day: { type: Date, required: false },
	commission: { type: Number, required: false },
	role: { type: String, required: true, enum: ["ADMIN", "EMPLOYEE", "CLIENT"] },
});

userSchema.statics.findOneOrCreate = function (condition, callback) {
    const self = this
    self.findOne(condition, (err, result) => {
        return result ? callback(err, result) : self.create(condition, (err, result) => { return callback(err, result) })
    })
}

const User = model("user", userSchema);
exports.User = User;
exports.UserSchema = userSchema;
