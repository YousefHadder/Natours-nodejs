// review / rating / createdAt / ref to the tour / ref to the user
const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
	{
		review: {
			type: String,
			required: [true, 'Review cannot be empty'],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: [true, 'Must provide a rating between 1 and 5'],
		},
		cretedAt: {
			type: Date,
			default: Date.now,
		},
		tour: {
			type: mongoose.Schema.ObjectId,
			ref: 'Tour',
			required: [true, 'Review must belong to a tour'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Review must belong to a user'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Populate tour and user in the review response
reviewSchema.pre(/^find/, async function (next) {
	this.populate({
		path: 'tour',
		select: 'name',
	});
	this.populate({
		path: 'user',
		select: 'name photo',
	});

	next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
