class APIFeatures {
	constructor(tourQuery, reqQuery) {
		this.tourQuery = tourQuery;
		this.reqQuery = reqQuery;
	}

	filter() {
		const queryObj = { ...this.reqQuery };

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

		this.tourQuery = this.tourQuery.find(JSON.parse(queryStr));
		return this;
	}

	sort() {
		const sortBy = this.reqQuery.sort
			? this.reqQuery.sort.split(',').join(' ')
			: '-createdAt';

		this.tourQuery = this.tourQuery.sort(sortBy);
		return this;
	}

	limitFields() {
		const fields = this.reqQuery.fields
			? this.reqQuery.fields.split(',').join(' ')
			: '-__v';
		this.tourQuery = this.tourQuery.select(fields);
		return this;
	}

	pagination() {
		const page = Number(this.reqQuery.page) || 1;
		const limit = Number(this.reqQuery.limit) || 10;
		const skip = (page - 1) * limit;

		this.tourQuery = this.tourQuery.skip(skip).limit(limit);
		return this;
	}
}

module.exports = APIFeatures;
