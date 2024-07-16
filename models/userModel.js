const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'User must have a name'],
	},
	email: {
		type: String,
		required: [true, 'User must have an email'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please enter a valid email'],
	},
	photo: String,
	password: {
		type: String,
		required: [true, 'User must have a password'],
		minlength: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Confirm password is required'],
		validate: {
			// This only works on CREATE and SAVE!!!
			validator: function (v) {
				return v === this.password;
			},
			message: 'Passwords do not match',
		},
	},
});

userSchema.pre(
	'save',
	// run this function if password is modified
	async function (next) {
		if (!this.isModified('password')) {
			return next();
		}
		this.password = await bcrypt.hash(this.password, 12);
		this.passwordConfirm = undefined;
		next();
	},
);

const User = mongoose.model('User', userSchema);

module.exports = User;
