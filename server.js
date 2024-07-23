const mongoose = require('mongoose');
const dotenv = require('dotenv');

// must be ran before all other code
process.on('uncaughtException', (err) => {
	console.error('Uncaught exception, ', err.message);
	process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('MongoDB Connected...'));

// Start the server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, '127.0.0.1', () => {
	console.log(`Server is running on port ${PORT}...`);
});

process.on('unhandledRejection', (err) => {
	console.error('Unhandled rejection, ', err.message);
	server.close(() => {
		process.exit(1);
	});
});
