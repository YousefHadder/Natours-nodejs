const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.alerts = (req, res, next) => {
	const { alert } = req.query;
	if (alert === 'booking') {
		res.locals.alert = `Your booking was successful! Please check your email for a confirmation.
		If your booking doesn't show up immediately, pleaes come back later.`;
	}
	next();
};

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

	const user = res.locals.user || null;
	if (user) {
		const booking = await Booking.findOne({
			tour: tour._id,
			user: user._id,
		});
		res.locals.isBooked = booking ? true : false;
	}
	// 2) Render template with the data
	res.status(200).render('tour', {
		title: tour.name,
		tour,
	});
});

exports.getLoginForm = (req, res) => {
	if (res.locals.user) {
		return res.redirect('/me');
	}
	res.status(200).render('login', {
		title: 'Login to your account',
	});
};

exports.getSignupForm = (req, res) => {
	res.status(200).render('signup', {
		title: 'Sign up for an account',
	});
};

exports.getAccount = (req, res) => {
	res.status(200).render('account', {
		title: 'Your Account',
	});
};

exports.getMyTours = catchAsync(async (req, res, next) => {
	const { id } = req.user;
	// 1) Find all bookings for the current user
	const bookings = await Booking.find({ user: id });

	// 2) Find all tours with returned IDs
	const tourIds = bookings.map((booking) => booking.tour);
	const tours = await Tour.find({
		_id: {
			$in: tourIds,
		},
	});
	res.status(200).render('overview', {
		title: 'My Booked Tours',
		tours,
	});
});

exports.getReviewPage = catchAsync(async (req, res, next) => {
	const { slug } = req.params;
	const tour = await Tour.findOne({ slug });
	if (!tour) {
		return next(new AppError('No tour found with that name', 404));
	}
	res.status(200).render('reviewForm', {
		title: `Review ${tour.name}`,
		tour,
	});
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
	const { id } = req.user;
	const reviews = await Review.find({ user: id }).populate({
		path: 'tour',
		select: 'name',
	});
	if (!reviews) {
		return next(new AppError('No reviews found for this user', 404));
	}
	res.status(200).render('reviews', {
		title: 'My Reviews',
		reviews,
	});
});

exports.getConfirmationPage = (req, res) => {
	res.status(200).render('confirmationPage', {
		title: 'Booking Confirmation',
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
