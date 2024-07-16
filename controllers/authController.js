const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
	// With the below line, a new user can send a role within the request body
	// and assume the role on the server (like admin)
	// const newUser = await User.create(req.body);

	// Ensuring only the data we want is used to register a new user
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	res.status(201).json({
		status: 'success',
		data: { user: newUser },
	});
});
