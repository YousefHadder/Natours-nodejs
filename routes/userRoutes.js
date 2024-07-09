const express = require('express');
const {
	getAllUsers,
	getUserById,
	createUser,
	updateUserById,
	deleteUserById,
} = require('../controllers/userController');
const router = express.Router();

// User routes
router.route('/').get(getAllUsers).post(createUser);
router
	.route('/:id')
	.get(getUserById)
	.patch(updateUserById)
	.delete(deleteUserById);

module.exports = router;
