const express = require('express');
const {
	getAllTours,
	getTourById,
	createTour,
	updateTourById,
	deleteTourById,
	checkId,
	checkBody,
} = require('../controllers/tourController');

const router = express.Router();

router.param('id', checkId);

// checkBody Middleware

// Tour routes
router.route('/').get(getAllTours).post(checkBody, createTour);
router
	.route('/:id')
	.get(getTourById)
	.patch(updateTourById)
	.delete(deleteTourById);

module.exports = router;
