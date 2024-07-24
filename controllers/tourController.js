const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTop5Tours = async (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,difficulty';
	next();
};

// Factory method
exports.getAllTours = factory.getAll(Tour);
exports.getTourById = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTourById = factory.updateOne(Tour);
exports.deleteTourById = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
	const stats = await Tour.aggregate([
		{
			$match: {
				ratingsAverage: {
					$gte: 4.5,
				},
			},
		},
		{
			$group: {
				_id: { $toUpper: '$difficulty' },
				numRatings: {
					$sum: '$ratingsQuantity',
				},
				numTours: {
					$sum: 1,
				},
				averageRating: {
					$avg: '$ratingsAverage',
				},
				averagePrice: {
					$avg: '$price',
				},
				minPrice: {
					$min: '$price',
				},
				maxPrice: {
					$max: '$price',
				},
			},
		},
		{
			$sort: {
				numRatings: -1,
				averageRating: -1,
				averagePrice: 1,
				_id: 1,
			},
		},
	]);
	res.status(200).json({
		status: 'success',
		data: stats,
	});
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
	const { year } = req.params;
	const plan = await Tour.aggregate([
		{
			$unwind: '$startDates',
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: {
					$month: '$startDates',
				},
				numTours: {
					$sum: 1,
				},
				tours: {
					$push: {
						name: '$name',
					},
				},
			},
		},
		{
			$addFields: {
				month: '$_id',
			},
		},
		{
			$project: {
				_id: 0,
				month: 1,
				numTours: 1,
				tours: 1,
			},
		},
		{
			$sort: {
				numTours: -1,
			},
		},
		{
			$limit: 1,
		},
	]);

	res.status(200).json({
		status: 'success',
		data: plan,
	});
});
