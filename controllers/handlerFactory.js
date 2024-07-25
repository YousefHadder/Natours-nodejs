const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const { id } = req.params;
		const doc = await Model.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}
		res.status(200).json({
			status: 'success',
			data: { doc },
		});
	});
exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const { id } = req.params;
		const doc = await Model.findByIdAndDelete(id);
		if (!doc) {
			throw new AppError('ID not Found', 404);
		}
		res.status(200).json({
			status: 'success',
			data: null,
		});
	});

exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);
		res.status(201).json({
			status: 'success',
			data: { doc },
		});
	});

exports.getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		const { id } = req.params;
		let query = Model.findById(id);
		if (popOptions) {
			query = query.populate(popOptions);
		}

		const doc = await query;
		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}

		res.status(200).json({
			status: 'success',
			data: { doc },
		});
	});

exports.getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		// To allow nested GET reviews on tour (work around)
		let filter = {};
		if (req.params.tourId) {
			filter = { tour: req.params.tourId };
		}
		const apiFeatures = new APIFeatures(Model.find(filter), req.query)
			.filter()
			.sort()
			.limitFields()
			.pagination();

		// 5) Execute the query
		const doc = await apiFeatures.docQuery;

		res.status(200).json({
			status: 'success',
			results: doc.length,
			data: { doc },
		});
	});
