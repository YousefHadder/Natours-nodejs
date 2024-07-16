const express = require('express');
const { signup, login } = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');

const router = express.Router();
// User routes
router.post('/signup', signup);
router.post('/login', login);

router.route('/').get(getAllUsers);

module.exports = router;
