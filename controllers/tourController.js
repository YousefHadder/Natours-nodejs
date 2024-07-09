const fs = require('fs');

const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'),
);

exports.checkBody = (req, res, next) => {
	const { name, price } = req.body;
	if (!name || !price) {
		return res.status(400).json({
			status: 'fail',
			message: 'Name and price are required.',
		});
	}
	next();
};

exports.checkId = (req, res, next, val) => {
	const index = tours.findIndex((t) => t.id === parseInt(val, 10));
	if (index === -1) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID.',
		});
	}
	req.index = index;
	console.log(req.index);
	next();
};

exports.getAllTours = (req, res) => {
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: { tours },
	});
};

exports.getTourById = (req, res) => {
	const tour = tours[req.index];
	res.status(200).json({
		status: 'success',
		data: { tour },
	});
};

exports.createTour = (req, res) => {
	const newId = tours[tours.length - 1].id + 1;
	const newTour = Object.assign({ id: newId }, req.body);
	tours.push(newTour);
	fs.writeFile(
		`${__dirname}/../dev-data/data/tours-simple.json`,
		JSON.stringify(tours),
		(err) => {
			res.status(201).json({
				status: 'success',
				message: 'New tour created.',
				data: { tour: newTour },
			});
		},
	);
};

exports.updateTourById = (req, res) => {
	const updatedTour = Object.assign(tours[req.index], req.body);
	tours[req.index] = updatedTour;
	fs.writeFile(
		`${__dirname}/../dev-data/data/tours-simple.json`,
		JSON.stringify(tours),
		(err) => {
			res.status(200).json({
				status: 'success',
				message: 'tour updated.',
				data: { tour: updatedTour },
			});
		},
	);
};

exports.deleteTourById = (req, res) => {
	tours.splice(req.index, 1);
	fs.writeFile(
		`${__dirname}/../dev-data/data/tours-simple.json`,
		JSON.stringify(tours),
		(err) => {
			res.status(200).json({
				status: 'success',
				message: 'tour deleted.',
			});
		},
	);
};
