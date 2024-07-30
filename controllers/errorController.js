const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};
const handleDuplicateFieldDB = (err) => {
	const message = `'${err.errmsg.match(/(?<=")[^"]*(?=")/g)}' already exists`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join('. ')}`;
	return new AppError(message, 400);
};

const handleJWTError = () =>
	new AppError('Invalid token. Please log in again', 401);
const handleJWTTokenExpiredError = () =>
	new AppError('Token expired. Please log in again', 401);

const sendDevError = (err, req, res) => {
	// API
	if (req.originalUrl.startsWith('/api')) {
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
			stack: err.stack,
			error: err,
		});
	}
	// RENDERED WEBSITE
	// non-operational, untrusted errors.
	console.error(`Error: ${err}`);
	return res.status(err.statusCode).render('error', {
		title: 'Something went wrong!',
		msg: err.message,
	});
};

const sendProdError = (err, req, res) => {
	// A) API
	if (req.originalUrl.startsWith('/api')) {
		// operational, trusted errors.
		if (err.isOperational) {
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message,
			});
		}

		// programming or other unknown error: don't leak error details
		// 1) Log Error
		console.error(`Error: ${err}`);

		// 2) Send generic message
		return res.status(500).json({
			status: 'error',
			message: 'Something went wrong!',
		});
	}

	// B) RENDERED WEBSITE
	if (err.isOperational) {
		return res.status(err.statusCode).render('error', {
			title: 'Something went wrong!',
			msg: err.message,
		});
	}

	// programming or other unknown error: don't leak error details
	// 1) Log Error
	console.error(`Error: ${err}`);

	// 2) Send generic message
	return res.status(err.statusCode).render('error', {
		title: 'Something went wrong!',
		msg: 'Please try again later.',
	});
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendDevError(err, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		let errObj = Object.create(err);

		if (errObj.name === 'CastError') {
			errObj = handleCastErrorDB(errObj);
		}
		if (errObj.code === 11000) {
			errObj = handleDuplicateFieldDB(errObj);
		}
		if (errObj.name === 'ValidationError') {
			errObj = handleValidationErrorDB(errObj);
		}
		if (errObj.name === 'JsonWebTokenError') {
			errObj = handleJWTError(errObj);
		}
		if (errObj.name === 'TokenExpiredError') {
			errObj = handleJWTTokenExpiredError(errObj);
		}
		sendProdError(errObj, req, res);
	}
};
