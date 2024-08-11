const express = require('express');
const {
	createReview,
	getAllReviews,
	deleteReviewById,
	updateReviewById,
	setTourUserIds,
	getReviewById,
	checkUserBooking,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
	.route('/')
	.get(getAllReviews)
	.post(restrictTo('user'), setTourUserIds, checkUserBooking, createReview);

router
	.route('/:id')
	.get(getReviewById)
	.patch(restrictTo('user', 'admin'), updateReviewById)
	.delete(restrictTo('user', 'admin'), deleteReviewById);

module.exports = router;
