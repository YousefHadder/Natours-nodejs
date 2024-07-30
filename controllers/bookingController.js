const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
	const { tourId } = req.params;
	// 1) Get the booked tour
	const tour = await Tour.findById(tourId);
	if (!tour) {
		return next(new AppError('No tour found with that ID', 404));
	}
	// 2) Create a checkout session for the tour
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
		cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}/`,
		customer_email: req.user.email,
		client_reference_id: req.params.tourId,
		mode: 'payment',
		line_items: [
			{
				price_data: {
					unit_amount: tour.price * 100, // Convert to cents
					currency: 'usd',
					product_data: {
						name: `${tour.name} Tour`,
						description: tour.summary,
						images: [
							`https://www.natours.dev/img/tours/${tour.imageCover}`,
						],
					},
				},
				quantity: 1,
			},
		],
	});

	// 3) Send the checkout session to the client
	res.status(200).json({
		status: 'success',
		session,
	});
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
	// This is only TEMPORARY, because it's UNSECURE
	// anyone can create a booking without paying.
	const { tour, user, price } = req.query;
	if (!tour || !user || !price) {
		return next();
	}
	await Booking.create({ tour, user, price });

	res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBookingById = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBookingById = factory.updateOne(Booking);
exports.deleteBookingById = factory.createOne(Booking);
