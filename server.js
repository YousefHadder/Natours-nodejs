const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('MongoDB Connected...'));

const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name'],
		unique: true,
	},
	price: {
		type: Number,
		required: [true, 'A tour must have a price'],
	},
	rating: {
		type: Number,
		min: 1,
		max: 5,
		default: 4.5,
	},
});

const Tour = mongoose.model('Tour', tourSchema);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`);
});
