const express = require('express');
const {
	signup,
	login,
	forgotPassword,
	resetPassword,
	updatePassword,
	protect,
	restrictTo,
	logout,
} = require('../controllers/authController');
const {
	getAllUsers,
	updateMe,
	deleteMe,
	getUserById,
	updateUserById,
	deleteUserById,
	getMe,
	createUser,
	uploadUserPhoto,
	resizeUserPhoto,
} = require('../controllers/userController');

const router = express.Router();

// User authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect all routes after this middleware
router.use(protect);

router.get('/me', getMe, getUserById);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.patch('/updateMyPassword', updatePassword);
router.delete('/deleteMe', deleteMe);

// Restrict All following routes to admin
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router
	.route('/:id')
	.get(getUserById)
	.patch(updateUserById)
	.delete(deleteUserById);

module.exports = router;
