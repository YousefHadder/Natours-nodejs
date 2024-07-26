const express = require('express');
const {
	getOverviewPage,
	getTourPage,
} = require('../controllers/viewController');

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

router.get('/', getOverviewPage);
router.get('/tours/:slug', getTourPage);

module.exports = router;
