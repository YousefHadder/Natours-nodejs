const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.aliasTop5Tours = async (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,difficulty';
	next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
	const apiFeatures = new APIFeatures(Tour.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.pagination();
	// 5) Execute the query
	const tours = await apiFeatures.tourQuery;

	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: { tours },
	});
});

exports.getTourById = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const tour = await Tour.findById(id);

	if (!tour) {
		return next(new AppError('No tour found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: { tour },
	});
});

exports.createTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.create(req.body);
	res.status(201).json({
		status: 'success',
		data: { tour },
	});
});

exports.updateTourById = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const tour = await Tour.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!tour) {
		return next(new AppError('No tour found with that ID', 404));
	}
	res.status(200).json({
		status: 'success',
		data: { tour },
	});
});

exports.deleteTourById = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const result = await Tour.findByIdAndDelete(id);
	if (!result) {
		throw new AppError('Tour ID not Found', 404);
	}
	res.status(200).json({
		status: 'success',
		message: 'Tour deleted successfully.',
		result,
	});
});

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
		// {
		// 	$match: {
		// 		_id: {
		// 			$ne: 'EASY',
		// 		},
		// 	},
		// },
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
