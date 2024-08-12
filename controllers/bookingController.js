const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
	const { tourId } = req.params;
	const selectedDate = req.params.selectedDate;
	// 1) Get the booked tour
	const tour = await Tour.findById(tourId);
	if (!tour) {
		return next(new AppError('No tour found with that ID', 404));
	}

	// 2) Create a checkout session for the tour
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		success_url: `${req.protocol}://${req.get('host')}/my-tours`,
		cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}/`,
		customer_email: req.user.email,
		client_reference_id: req.params.tourId,
		mode: 'payment',
		metadata: {
			selectedDate,
		},
		line_items: [
			{
				price_data: {
					unit_amount: tour.price * 100, // Convert to cents
					currency: 'usd',
					product_data: {
						name: `${tour.name} Tour`,
						description: tour.summary,
						images: [
							`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
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

const createBookingCheckout = async (session) => {
	const tourId = session.client_reference_id;
	const userId = (await User.findOne({ email: session.customer_email })).id;
	const price = session.amount_total / 100;
	const selectedDate = session.metadata.selectedDate;

	const tour = await Tour.findOne({ _id: tourId });
	const index = tour.startDates.findIndex(
		(date) => date.date.toISOString() === selectedDate,
	);
	console.log(index);
	tour.startDates[index].participants++;
	if (tour.startDates[index].participants >= tour.maxGroupSize) {
		tour.startDates[index].soldOut = true;
	}
	await tour.save();
	await Booking.create({ tourId, userId, price });
};

exports.webhookCheckout = (req, res) => {
	const signature = req.headers['stripe-signature'];
	let event;
	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET_DEV,
		);
	} catch (err) {
		return res.status(400).send(`Webhook error: ${err.message}`);
	}
	if (event.type === 'checkout.session.completed') {
		createBookingCheckout(event.data.object);
	}
	res.status(200).json({ received: true });
};

// Factory methods for booking
exports.createBooking = factory.createOne(Booking);
exports.getBookingById = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBookingById = factory.updateOne(Booking);
exports.deleteBookingById = factory.createOne(Booking);
