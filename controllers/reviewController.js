const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
	if (!req.body.tour) {
		req.body.tour = req.params.tourId;
	}
	if (!req.body.user) {
		req.body.user = req.user.id;
	}
	next();
};
exports.checkUserBooking = async (req, res, next) => {
	const booking = await Booking.findOne({
		tour: req.body.tour,
		user: req.body.user,
		paid: true,
	});
	if (!booking)
		return next(
			new AppError(
				'Cannot create a review for this tour as you have not booked it yet.',
				403,
			),
		);
	next();
};
exports.getAllReviews = factory.getAll(Review);
exports.getReviewById = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReviewById = factory.updateOne(Review);
exports.deleteReviewById = factory.deleteOne(Review);
