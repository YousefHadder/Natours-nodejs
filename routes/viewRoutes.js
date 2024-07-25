const express = require('express');
const {
	getOverviewPage,
	getTourPage,
} = require('../controllers/viewController');

const router = express.Router();

router.get('/', getOverviewPage);

router.get('/tour', getTourPage);

module.exports = router;
