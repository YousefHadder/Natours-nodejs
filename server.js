const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`);
});
