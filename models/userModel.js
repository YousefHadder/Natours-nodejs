const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'User must have a name'],
	},
	email: {
		type: String,
		required: [true, 'User must have an email'],
		uniqure: true,
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
			validator: function (v) {
				return v === this.password;
			},
			message: 'Passwords do not match',
		},
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
