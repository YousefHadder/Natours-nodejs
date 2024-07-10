const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name'],
		unique: true,
	},
	duration: {
		type: Number,
		required: [true, 'A tour must have a duration'],
	},
	maxGroupSize: {
		type: Number,
		required: [true, 'A tour must have a group size'],
	},
	difficulty: {
		type: String,
		enum: ['easy', 'medium', 'difficult'],
		required: [true, 'A tour must have a difficulty'],
	},
	ratingAverage: {
		type: Number,
		default: 4.5,
	},
	ratingQuantity: {
		type: Number,
		default: 0,
	},
	price: {
		type: Number,
		required: [true, 'A tour must have a price'],
	},
	priceDiscount: {
		type: Number,
		default: 0,
	},
	summary: {
		type: String,
		trim: true,
		required: [true, 'A tour must have a summary'],
	},
	description: {
		type: String,
		trim: true,
		required: [true, 'A tour must have a description'],
	},
	imageCover: {
		type: String,
		required: [true, 'A tour must have a cover image'],
	},
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now,
		select: false,
	},
	startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
