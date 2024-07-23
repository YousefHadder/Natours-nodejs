const hpp = require('hpp');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const express = require('express');
const rateLimit = require('express-rate-limit');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1) Global Middlewares
// Set Security HTTP headers
app.use(helmet());

// Development logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000, // 1 hour
	message: 'Too many requests from this IP, please try again in an hour!',
});

// Limit requests from same IP
app.use('/api', limiter);

// Body Parser middleware
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS (Cross-Site Scripting)
app.use(xss());

//prevent parameter pollution
app.use(
	hpp({
		whitelist: [
			'duration',
			'difficulty',
			'ratingsAverage',
			'ratingsQuantity',
			'price',
			'maxGroupSize',
		],
	}),
);

// Serving static files from the 'public' directory (public folder)
app.use(express.static(`${__dirname}/public`));

// Route Handlers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// Global Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
