const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverviewPage = catchAsync(async (req, res, next) => {
	// 1) Get all tours from the database
	const tours = await Tour.find();

	// 2) Render template with the data
	res.status(200).render('overview', {
		title: 'All Tours',
		tours,
	});
});

exports.getTourPage = catchAsync(async (req, res, next) => {
	// 1) Get the tour from the database by its slug including guides and reviews
	const { slug } = req.params;
	const tour = await Tour.findOne({ slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	});
	if (!tour) {
		return next(new AppError('No tour found with that name', 404));
	}

	// 2) Render template with the data
	res.status(200).render('tour', {
		title: tour.name,
		tour,
	});
});

exports.getLoginForm = (req, res) => {
	res.status(200).render('login', {
		title: 'Login to your account',
	});
};

exports.getAccount = (req, res) => {
	res.status(200).render('account', {
		title: 'Your Account',
	});
};

exports.updateUserData = catchAsync(async (req, res, next) => {
	const { id } = req.user;
	// 1) Get the user document from the database
	const updatedUser = await User.findByIdAndUpdate(
		id,
		{
			name: req.body.name,
			email: req.body.email,
		},
		{ new: true, runValidators: true },
	);
	res.status(200).render('account', {
		title: 'Your Account',
		user: updatedUser,
	});
});
