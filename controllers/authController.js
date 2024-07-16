const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

exports.signup = catchAsync(async (req, res, next) => {
	// With the below line, a new user can send a role within the request body
	// and assume the role on the server (like admin)
	// const newUser = await User.create(req.body);

	// Ensuring only the data we want is used to register a new user
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		photo: req.body.photo || '',
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	const token = signToken(newUser._id);

	res.status(201).json({
		status: 'success',
		token,
		data: {
			user: newUser,
		},
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// 1) Check if email and password exist
	if (!email || !password) {
		return next(new AppError('Please provide email and password', 400));
	}

	// 2) Check if user exists and password is correct
	const user = await User.findOne({ email }).select('+password');
	const correctPassword = await user?.correctPassword(
		password,
		user?.password,
	);
	if (!user || !correctPassword) {
		return next(new AppError('Incorrect email or password', 401));
	}
	// 3) If everything is ok, send token to the client
	const token = signToken(user._id);

	res.status(200).json({
		status: 'success',
		token,
	});
});
