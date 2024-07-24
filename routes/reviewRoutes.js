const express = require('express');
const { getReviews, createReview } = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.route('/:tourId').get(getReviews);
router.route('/').post(protect, restrictTo('user'), createReview);

module.exports = router;
