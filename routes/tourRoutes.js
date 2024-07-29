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
	getToursWithin,
	getDistances,
	uploadTourImages,
	resizeTourImages,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Tour routes

// Mount the review routes under the tour route
router.use('/:tourId/reviews', reviewRouter);
router.route('/tour-stats').get(getTourStats);
router.route('/top-5-cheap').get(aliasTop5Tours, getAllTours);

router
	.route('/tours-within/:distance/center/:latlng/unit/:unit')
	.get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
	.route('/')
	.get(getAllTours)
	.post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
	.route('/:id')
	.get(getTourById)
	.patch(
		protect,
		restrictTo('admin', 'lead-guide'),
		uploadTourImages,
		resizeTourImages,
		updateTourById,
	)
	.delete(protect, restrictTo('admin', 'lead-guide'), deleteTourById);

router
	.route('/monthly-plan/:year')
	.get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

module.exports = router;
