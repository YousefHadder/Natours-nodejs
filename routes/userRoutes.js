const express = require('express');
const {
	signup,
	login,
	forgotPassword,
	resetPassword,
} = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');

const router = express.Router();
// User routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.route('/').get(getAllUsers);

module.exports = router;
