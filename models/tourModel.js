const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const dateSchema = new mongoose.Schema({
	date: { type: Date, required: true },
	participants: { type: Number, default: 0 },
	soldOut: { type: Boolean, default: false },
});

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			unique: true,
			trim: true,
			validate: {
				validator: function (v) {
					return validator.isLength(v, { min: 10, max: 50 });
				},
				message: 'Tour name must be between 10 and 50 characters',
			},
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
			set: (val) => Math.round(val * 10) / 10.0,
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
		startDates: {
			type: [dateSchema],
			set: function (dates) {
				// Convert strings or Date objects to the required dateSchema format
				return dates.map((date) => {
					if (typeof date === 'string' || date instanceof Date) {
						return {
							date: new Date(date),
							participants: 0, // Default value
							maxParticipants: 20, // Default value, adjust as needed
							soldOut: false, // Default value
						};
					}
					return date; // If already in the correct format, leave it as is
				});
			},
		},
		secretTour: {
			type: Boolean,
			default: false,
			select: false,
		},
		startLocation: {
			// GeoJSON DataType
			type: {
				type: String,
				default: 'Point',
				enum: ['Point'],
			},
			coordinates: [Number],
			adress: String,
			description: String,
		},
		locations: [
			{
				type: {
					type: String,
					default: 'Point',
					enum: ['Point'],
				},
				coordinates: [Number],
				adress: String,
				description: String,
				day: Number,
			},
		],
		guides: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

// Virtual Populate Tour and User in a Review response
tourSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'tour',
	localField: '_id',
});

tourSchema.virtual('durationWeeks').get(function () {
	return this.duration / 7;
});

// 1) Document Middleware

// runs before save and create commands, but not insert Many
tourSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

// 2) Query Middleware

// Calculate Query execution time
tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });
	this.start = Date.now();
	next();
});

// Populate guides in the response
tourSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'guides',
		select: '-__v -passwordChangedAt -loginAttempts -lockUntil',
	});
	next();
});

// Log query execution time

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
