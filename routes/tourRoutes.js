const express = require('express');
const router = express.Router();
const {
	getAllTours,
	getTourById,
	createTour,
	updateTourById,
	deleteTourById,
} = require('../controllers/tourController');

router.route('/').get(getAllTours).post(createTour);
router
	.route('/:id')
	.get(getTourById)
	.patch(updateTourById)
	.delete(deleteTourById);

module.exports = router;
