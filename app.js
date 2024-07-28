const hpp = require('hpp');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000, // 1 hour
	message: 'Too many requests from this IP, please try again in an hour!',
});

// Tell Express to use Pug (Jade) templating engine
app.set('view engine', 'pug');

// Tell Express to use the 'views' directory for templates
// Use path module to avoid mistakes like forgetting to add / to the directory
app.set('views', path.join(__dirname, 'views'));

// 1) Global Middlewares

// Serving static files from the 'public' directory (public folder)
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP headers
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'", 'https://*.mapbox.com'],
			connectSrc: ["'self'", 'ws://127.0.0.1:62945'],
		},
	}),
);
// Development logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));

	app.use((req, res, next) => {
		res.setHeader(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com; connect-src 'self' ws://127.0.0.1:*;",
		);
		next();
	});
}

// Limit requests from same IP
app.use('/api', limiter);

// Body Parser middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

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

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// Route Handlers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// Global Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
