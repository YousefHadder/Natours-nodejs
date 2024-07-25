const express = require('express');
const {
	getAllTours,
	getTourById,
	createTour,
	updateTourById,
	deleteTourById,
	aliasTop5Tours,
	getTourStats,
	getMonthlyPlan,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Tour routes
router
	.route('/')
	.get(getAllTours)
	.post(protect, restrictTo('admin', 'lead-guide'), createTour);

// Mount the review routes under the tour route
router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(getTourStats);

router.route('/top-5-cheap').get(aliasTop5Tours, getAllTours);

router
	.route('/:id')
	.get(getTourById)
	.patch(protect, restrictTo('admin', 'lead-guide'), updateTourById)
	.delete(protect, restrictTo('admin', 'lead-guide'), deleteTourById);

router
	.route('/monthly-plan/:year')
	.get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

module.exports = router;
