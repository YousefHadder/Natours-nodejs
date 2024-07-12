const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};
const handleDublicateFieldDB = (err) => {
	const message = `Duplicate field value: '${err.errmsg.match(/(?<=")[^"]*(?=")/g)}' already exists`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. [${errors.join('. ')}]`;
	return new AppError(message, 400);
};

const sendDevError = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
		error: err,
	});
};
const sendProdError = (err, res) => {
	// operational, trusted errors.
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		// programming or other unknown error: don't leak error details
		// 1) Log Error
		console.error(`Error:${err}`);

		// 2) Send generic message
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong!',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendDevError(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		let errObj = Object.create(err);
		console.log(errObj.name);
		if (errObj.name === 'CastError') {
			errObj = handleCastErrorDB(errObj);
		}
		if (errObj.code === 11000) {
			errObj = handleDublicateFieldDB(errObj);
		}
		if (errObj.name === 'ValidationError') {
			errObj = handleValidationErrorDB(errObj);
		}
		sendProdError(errObj, res);
	}
};
