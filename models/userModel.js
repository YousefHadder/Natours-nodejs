const crypto = require('crypto');
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
	role: {
		type: String,
		enum: ['user', 'guide', 'lead-guide', 'admin'],
		default: 'user',
	},
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
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
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

userSchema.pre('save', function (next) {
	// Update changedPasswordAt if password is changed
	if (!this.isModified('password') || this.isNew) {
		return next();
	}
	this.passwordChangedAt = Date.now() - 1000;

	next();
});

// Instance method to compare password
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword,
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10,
		);
		return JWTTimestamp < changedTimestamp;
	}
	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	// Generate a random token and hash it
	// This token will be used to reset the password
	const resetToken = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// Set expiration date for the reset token
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

	// Will be returned to the client via email.
	return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
