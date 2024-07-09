const express = require('express');
const fs = require('fs');

const app = express();

const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'),
);

app.use(express.json());

const getAllTours = (req, res) => {
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: { tours },
	});
};

const getTourById = (req, res) => {
	const { id } = req.params;
	const tour = tours.find((t) => t.id === parseInt(id));
	if (!tour) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID.',
		});
	}
	res.status(200).json({
		status: 'success',
		data: { tour },
	});
};

const createTour = (req, res) => {
	const newId = tours[tours.length - 1].id + 1;
	const newTour = Object.assign({ id: newId }, req.body);
	tours.push(newTour);
	fs.writeFile(
		`${__dirname}/dev-data/data/tours-simple.json`,
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
const updateTourById = (req, res) => {
	const { id } = req.params;
	const index = tours.findIndex((t) => t.id === parseInt(id));
	if (index === -1) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID.',
		});
	}
	const updatedTour = Object.assign(tours[index], req.body);
	tours[index] = updatedTour;
	fs.writeFile(
		`${__dirname}/dev-data/data/tours-simple.json`,
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
const deleteTourById = (req, res) => {
	const { id } = req.params;
	const index = tours.findIndex((t) => t.id === parseInt(id));
	if (index === -1) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID.',
		});
	}
	tours.splice(index, 1);
	fs.writeFile(
		`${__dirname}/dev-data/data/tours-simple.json`,
		JSON.stringify(tours),
		(err) => {
			res.status(200).json({
				status: 'success',
				message: 'tour deleted.',
			});
		},
	);
};

// API routes
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTourById);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTourById);
app.delete('/api/v1/tours/:id', deleteTourById);

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`);
});
