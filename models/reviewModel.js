// review / rating / createdAt / ref to the tour / ref to the user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Populate tour and user in the review response
reviewSchema.pre(/^find/, async function (next) {
	this.populate({
		path: 'user',
		select: 'name photo',
	});

	next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
	const stats = await this.aggregate([
		{
			$match: { tour: tourId },
		},
		{
			$group: {
				_id: '$tour',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' },
			},
		},
	]);
	await Tour.findByIdAndUpdate(tourId, {
		ratingsAverage: stats[0]?.avgRating || 4.5,
		ratingsQuantity: stats[0]?.nRatings || 0,
	});
};

reviewSchema.post('save', function () {
	// this points to the current review document
	this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
	this.r = await this.clone().findOne();
	next();
});

reviewSchema.post(/^findOneAnd/, async function () {
	// await this.findOne(); does NOT work here, query has already executed
	await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
