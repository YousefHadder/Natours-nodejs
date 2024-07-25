const factory = require('./handlerFactory');
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

exports.getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};
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

exports.getAllUsers = factory.getAll(User);
exports.getUserById = factory.getOne(User);
exports.updateUserById = factory.updateOne(User); // Do Not update passwords with this, this route is for admins.
exports.deleteUserById = factory.deleteOne(User);

exports.createUser = (req, res, next) => {
	res.status(500).json({
		status: 'error',
		message:
			'This route is not for creating users. Please use /signup instead.',
	});
};
