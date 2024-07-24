const express = require('express');
const {
	signup,
	login,
	forgotPassword,
	resetPassword,
	updatePassword,
	protect,
} = require('../controllers/authController');
const {
	getAllUsers,
	updateMe,
	deleteMe,
	getUserById,
	updateUserById,
	deleteUserById,
} = require('../controllers/userController');

const router = express.Router();
// User routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers);

router
	.route('/:id')
	.get(protect, getUserById)
	.patch(protect, updateUserById)
	.delete(protect, deleteUserById);
module.exports = router;
