const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTop5Tours = async (req, res, next) => {
	req.params.limit = '5';
	req.params.sort = '-ratingsAverage,price';
	req.params.fields = 'name,price,ratingsAverage,difficulty';
	next();
};

exports.getAllTours = async (req, res) => {
	try {
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
	} catch (err) {
		res.status(404).json({
			status: 'fails',
			message: err.message,
		});
	}
};

exports.getTourById = async (req, res) => {
	try {
		const { id } = req.params;
		const apiFeatures = new APIFeatures(
			Tour.findById(id),
			req.query,
		).limitFields();

		const tour = await apiFeatures.tourQuery;

		res.status(200).json({
			status: 'success',
			data: { tour },
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err.message,
		});
	}
};

exports.createTour = async (req, res) => {
	try {
		const tour = await Tour.create(req.body);
		res.status(201).json({
			status: 'success',
			data: { tour },
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err.message,
		});
	}
};

exports.updateTourById = async (req, res) => {
	try {
		const { id } = req.params;
		const tour = await Tour.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			status: 'success',
			data: { tour },
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err.message,
		});
	}
};

exports.deleteTourById = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await Tour.findByIdAndDelete(id);
		if (!result) {
			throw new Error('Tour not found');
		}
		res.status(200).json({
			status: 'success',
			message: 'Tour deleted successfully.',
			result,
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err.message,
		});
	}
};

exports.getTourStats = async (req, res) => {
	try {
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
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err.message,
		});
	}
};

exports.getMonthlyPlan = async (req, res) => {
	try {
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
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err.message,
		});
	}
};
