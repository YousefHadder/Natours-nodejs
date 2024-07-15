const express = require('express');
const { signup } = require('../controllers/authController');

const router = express.Router();
// User routes
router.post('/signup', signup);

module.exports = router;
