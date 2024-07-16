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

const router = express.Router();

// Tour routes

router.route('/').get(protect, getAllTours).post(createTour);

router.route('/top-5-cheap').get(aliasTop5Tours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router
	.route('/:id')
	.get(getTourById)
	.patch(updateTourById)
	.delete(protect, restrictTo('admin', 'lead-guide'), deleteTourById);

module.exports = router;
