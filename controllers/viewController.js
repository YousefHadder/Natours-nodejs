const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverviewPage = catchAsync(async (req, res) => {
	// 1) Get all tours from the database
	const tours = await Tour.find();

	// 2) Build template file
	// 3) Render template with the data
	res.status(200).render('overview', {
		title: 'All Tours',
		tours,
	});
});

exports.getTourPage = catchAsync(async (req, res) => {
	// 1) Get the tour from the database by its slug including guides and reviews
	const { slug } = req.params;
	const tour = await Tour.findOne({ slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	});

	// 2) Build template
	// 3) Render template with the data
	res.status(200).render('tour', {
		title: tour.name,
		tour,
	});
});
