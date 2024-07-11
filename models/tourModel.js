const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			unique: true,
			trim: true,
			validate: [
				validator.isLength(
					{ min: 5, max: 50 },
					'Tour name must be between 5 and 50 characters',
				),
			]f,
		},
		slug: String,
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
			enum: {
				values: ['easy', 'medium', 'difficult'],
				message: 'Difficulty must be easy, medium, or difficult',
			},
			required: [true, 'A tour must have a difficulty'],
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, 'Rating must be between 1 and 5'],
			max: [5, 'Rating must be between 1 and 5'],
		},
		ratingsQuantity: {
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
			validate: {
				// this keyword only points to the current doc on NEW documents creation
				validator: function (val) {
					return val >= 0 && val <= 100;
				},
				message: 'Price discount {VALUE}% must be between 0 and 100',
			},
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
		secretTour: {
			type: Boolean,
			default: false,
			select: false,
		},
	},
	{
		toJSON: { virtuals: true },
	},
);

tourSchema.virtual('durationWeeks').get(function () {
	return this.duration / 7;
});

// 1) Document Middleware

// runs before save and create commands, but not insert Many
tourSchema.pre('save', function (next) {
	this.start = Date.now();
	this.slug = slugify(this.name, { lower: true });
	next();
});
tourSchema.post('save', async function (doc, next) {
	console.log(
		`New tour is created in ${Date.now() - doc.start} milliseconds`,
	);
});

// 2) Query Middleware

// Calculate Query execution time
tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });
	this.start = Date.now();
	next();
});
tourSchema.post(/^find/, function (docs, next) {
	console.log(`Query executed in ${Date.now() - this.start} milliseconds`);
	next();
});

// 3) Aggregation Middleware

// Hide secret tours from stats response
tourSchema.pre('aggregate', function (next) {
	this.pipeline().unshift({
		$match: {
			secretTour: {
				$ne: true,
			},
		},
	});
	next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
