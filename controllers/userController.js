const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
	const users = await User.find(req.body);
	res.status(200).json({
		status: 'success',
		data: {
			users,
		},
	});
});

exports.getUserById = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not implemented yet.',
	});
};
exports.createUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not implemented yet.',
	});
};

exports.updateUserById = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not implemented yet.',
	});
};
exports.deleteUserById = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not implemented yet.',
	});
};
