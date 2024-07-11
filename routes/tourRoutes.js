const express = require('express');
const {
	getAllTours,
	getTourById,
	createTour,
	updateTourById,
	deleteTourById,
	aliasTop5Tours,
} = require('../controllers/tourController');

const router = express.Router();

// Tour routes

router.route('/').get(getAllTours).post(createTour);

router.route('/top-5-cheap').get(aliasTop5Tours, getAllTours);

router
	.route('/:id')
	.get(getTourById)
	.patch(updateTourById)
	.delete(deleteTourById);

module.exports = router;
