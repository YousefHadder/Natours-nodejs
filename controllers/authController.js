const jwt = require('jsonwebtoken');
const { promisify } = require('util');
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
		passwordChangedAt: req.body.passwordChangedAt,
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

exports.protect = catchAsync(async (req, res, next) => {
	// 1) Getting token and chek if it's there
	const { authorization } = req.headers;
	let token = '';
	if (authorization && authorization.startsWith('Bearer')) {
		token = authorization.split(' ')[1];
	}
	if (!token) {
		return next(new AppError('You are not logged in', 401));
	}

	// 2) Verifiy token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	const { id } = decoded;

	// 3) Check if user exists and is not deleted
	const currUser = await User.findById(id);
	if (!currUser) {
		return next(new AppError('User no longer exists', 401));
	}

	// 4) Check if user has changed passowrd after token was issued
	if (currUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError('Password recently changed. Please log in again', 401),
		);
	}

	// 5) If all above checks pass, grant access to the route
	req.user = currUser;
	next();
});

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		// Check if the role in req is in ['admin, 'lead-guide']
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError(
					'You do not have permission to perform this action',
					403, // Forbidden
				),
			);
		}
		next();
	};
};
