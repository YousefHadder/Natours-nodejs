const express = require('express');
const {
	getOverviewPage,
	getTourPage,
	getLoginForm,
	getAccount,
	updateUserData,
	getSignupForm,
} = require('../controllers/viewController');
const { protect, isLoggedIn } = require('../controllers/authController');
const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router();

// We add createBookingCheckout here because we create a booking in the database
// right before redirecting to the path / .
router.get('/', createBookingCheckout, isLoggedIn, getOverviewPage);
router.get('/tours/:slug', isLoggedIn, getTourPage);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/signup', isLoggedIn, getSignupForm);
router.get('/me', protect, getAccount);
router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
