const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) {
			newObj[el] = obj[el];
		}
		return newObj;
	});
};

exports.getAllUsers = catchAsync(async (req, res) => {
	const users = await User.find(req.body);
	res.status(200).json({
		status: 'success',
		data: {
			users,
		},
	});
});

exports.updateMe = catchAsync(async (req, res, next) => {
	// 1) Create error if users POST password Data
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				'This route is not for password updates. Please use /updateMyPassword.',
				400,
			),
		);
	}

	// Don't pass req.body, because it might contain fields
	//that are not allowed to be updated such as role, or token.
	// 2) filter the fields to be updated using only allowedFields
	const filteredBody = filterObj(req.body, 'name', 'email', 'photo');

	// Cannot use findById then .save() because
	// required fields won't be validated.
	// 3) update user document
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		filteredBody,
		{
			new: true,
			runValidators: true,
		},
	);
	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
		},
	});
});

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });
	res.status(204).json({
		status: 'success',
		data: null,
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
