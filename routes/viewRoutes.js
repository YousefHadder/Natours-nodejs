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

const CSP = 'Content-Security-Policy';
const POLICY =
	"default-src 'self' https://*.mapbox.com ;" +
	"base-uri 'self';block-all-mixed-content;" +
	"font-src 'self' https: data:;" +
	"frame-ancestors 'self';" +
	"img-src http://localhost:8000 'self' blob: data:;" +
	"object-src 'none';" +
	"script-src https: cdn.jsdelivr.net cdnjs.cloudflare.com api.mapbox.com 'self' blob: ;" +
	"script-src-attr 'none';" +
	"style-src 'self' https: 'unsafe-inline';" +
	'upgrade-insecure-requests;';

const router = express.Router();
router.use((req, res, next) => {
	res.setHeader(CSP, POLICY);
	next();
});

router.get('/', isLoggedIn, getOverviewPage);
router.get('/tours/:slug', isLoggedIn, getTourPage);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/signup', isLoggedIn, getSignupForm);
router.get('/me', protect, getAccount);
router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
