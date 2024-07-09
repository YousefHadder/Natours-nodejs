const app = require('./app');

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`);
});
