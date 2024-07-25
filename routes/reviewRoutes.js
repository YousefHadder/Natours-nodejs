const express = require('express');
const {
	createReview,
	getAllReviews,
	deleteReviewById,
	updateReviewById,
	setTourUserIds,
	getReviewById,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
	.route('/')
	.get(getAllReviews)
	.post(restrictTo('user'), setTourUserIds, createReview);

router
	.route('/:id')
	.get(getReviewById)
	.patch(restrictTo('user', 'admin'), updateReviewById)
	.delete(restrictTo('user', 'admin'), deleteReviewById);

module.exports = router;
