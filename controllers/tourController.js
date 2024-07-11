const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTop5Tours = async (req, res, next) => {
	console.log('aliasing top 5 cheap tours');
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
	const { id } = req.params;
	try {
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
	const { id } = req.params;
	try {
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
	const { id } = req.params;
	try {
		await Tour.findByIdAndDelete(id);
		res.status(204).json({
			status: 'success',
			message: 'Tour deleted successfully.',
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err.message,
		});
	}
};
