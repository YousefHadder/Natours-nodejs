const hpp = require('hpp');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');

const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const { webhookCheckout } = require('./controllers/bookingController');

const app = express();

app.set('trust proxy', false);

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000, // 1 hour
	message: 'Too many requests from this IP, please try again in an hour!',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Tell Express to use Pug (Jade) tempting engine
app.set('view engine', 'pug');

// Tell Express to use the 'views' directory for templates
// Use path module to avoid mistakes like forgetting to add / to the directory
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files from the 'public' directory (public folder)
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP headers
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'", 'https://*.mapbox.com'],
				baseUri: ["'self'"],
				blockAllMixedContent: [],
				fontSrc: ["'self'", 'https:', 'data:'],
				frameAncestors: ["'self'"],
				imgSrc: ['http://localhost:8000', "'self'", 'blob:', 'data:'],
				objectSrc: ["'none'"],
				scriptSrc: [
					'https:',
					'cdn.jsdelivr.net',
					'cdnjs.cloudflare.com',
					'api.mapbox.com',
					"'self'",
					'blob:',
					'https://js.stripe.com',
				],
				scriptSrcAttr: ["'none'"],
				styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
				upgradeInsecureRequests: [],
				frameSrc: ["'self'", 'https://js.stripe.com'],
			},
		},
	}),
);

// Development logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Limit requests from same IP
app.use('/api', limiter);

// We add the webhook route here and not in the booking router
// the stripe function we will use to read the body of the request
// needs this body in a raw form, so we add it before the json body parser
app.post(
	'/webhook-checkout',
	express.raw({ type: 'application/json' }),
	webhookCheckout,
);

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

app.use(compression());

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// Route Handlers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// All other unimplemented routes return 404
app.all('*', (req, res, next) => {
	next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// Global Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
