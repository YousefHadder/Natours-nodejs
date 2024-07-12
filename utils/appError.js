class AppError extends Error {
	constructor(message, statusCode) {
		/*
		 * This class handles operations errors (4xx)
		 * and application errors(5xx) only
		 */

		super(message);
		this.statusCode = statusCode || 500;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;

		// This will ensure this function call will not appear in the stack trace
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = AppError;
