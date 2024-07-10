const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
	try {
		// 1) Build the query

		// Destructuring query parameters
		const queryObj = { ...req.query };

		// Those fields are related to how the data is presented rather than
		// the data selection criteria so we exclude them from the query
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach((el) => delete queryObj[el]);
		// 2) Advanced filtering
		const replaceMongoOperators = (key) => `$${key}`;

		// Replace operators like gt, gte, lt, lte, in with $gt, $gte, $lt, $lte, $in
		let queryStr = JSON.stringify(queryObj).replace(
			/\b(gt|gte|lt|lte|in)\b/g,
			replaceMongoOperators,
		);

		// Function to handle special characters in the query string
		const handleSpecialCharacters = (match) =>
			match[1] === '[' ? match[1] : match[0];

		// Handle special characters like quoted square brackets
		queryStr = queryStr.replace(
			/(['"]\[|\]['"])/g,
			handleSpecialCharacters,
		);

		// Remove backslashes
		queryStr = queryStr.replace(/\\/g, '');

		// 2) Sorting
		const sortBy = req.query.sort
			? req.query.sort.split(',').join(' ')
			: '-createdAt';

		// 3) Fields Limiting
		const fields = req.query.fields
			? req.query.fields.split(',').join(' ')
			: '-__v';

		// 4) Pagination
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		if (req.query.page) {
			const numTours = await Tour.countDocuments();
			if (skip >= numTours) {
				throw new Error('Page not found');
			}
		}

		const tourQuery = Tour.find(JSON.parse(queryStr))
			.sort(sortBy)
			.select(fields)
			.skip(skip)
			.limit(limit);

		// 5) Execute the query
		const tours = await tourQuery;
		res.status(200).json({
			status: 'success',
			results: tours.length,
			data: { tours },
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err.message,
		});
	}
};

exports.getTourById = async (req, res) => {
	const { id } = req.params;
	try {
		const tour = await Tour.findById(id);
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
