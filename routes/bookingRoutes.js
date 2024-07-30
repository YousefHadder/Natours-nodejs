const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
	getCheckoutSession,
	createBooking,
	getAllBooking,
	getBookingById,
	updateBookingById,
	deleteBookingById,
} = require('../controllers/bookingController');

const router = express.Router();

router.use(protect);

router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(restrictTo('admin', 'lead-guide'));

router.route('/').get(getAllBooking).post(createBooking);
router
	.route('/:id')
	.get(getBookingById)
	.put(updateBookingById)
	.delete(deleteBookingById);

module.exports = router;
