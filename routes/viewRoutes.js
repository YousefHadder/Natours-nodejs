const express = require('express');
const {
	getOverviewPage,
	getTourPage,
	getLoginForm,
	getAccount,
	updateUserData,
	getSignupForm,
	getMyTours,
	alerts,
	getReviewPage,
	getMyReviews,
	getConfirmationPage,
} = require('../controllers/viewController');
const {
	protect,
	isLoggedIn,
	verifyEmail,
} = require('../controllers/authController');

const router = express.Router();

router.use(alerts);
// We add createBookingCheckout here because we create a booking in the database
// right before redirecting to the path / .
router.get('/', isLoggedIn, getOverviewPage);
router.get('/tour/:slug', isLoggedIn, getTourPage);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/signup', isLoggedIn, getSignupForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);
router.get('/verifyEmail/:token', verifyEmail);
router.get('/my-reviews', protect, getMyReviews);
router.get('/confirmationPage', isLoggedIn, getConfirmationPage);
router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
