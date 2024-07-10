const express = require('express');
const {
	getAllTours,
	getTourById,
	createTour,
	updateTourById,
	deleteTourById,
} = require('../controllers/tourController');

const router = express.Router();

// Tour routes
router.route('/').get(getAllTours).post(createTour);
router
	.route('/:id')
	.get(getTourById)
	.patch(updateTourById)
	.delete(deleteTourById);

module.exports = router;
