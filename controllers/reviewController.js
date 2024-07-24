const Review = require('../models/reviewModel');
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

exports.getAllReviews = factory.getAll(Review);
exports.getReviewById = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReviewById = factory.updateOne(Review);
exports.deleteReviewById = factory.deleteOne(Review);
