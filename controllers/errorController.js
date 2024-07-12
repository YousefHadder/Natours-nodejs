// Giving 4 arguments, express knows this is an error middleware
// args: error, request, response, next
module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
	});
	next();
};
