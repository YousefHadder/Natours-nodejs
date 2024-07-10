const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
	try {
		const tours = await Tour.find();
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
		const tour = await Tour.create(req.body, {
			runValidators: true,
		});
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
