class APIFeatures {
	constructor(docQuery, reqQuery) {
		this.docQuery = docQuery;
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

		this.docQuery = this.docQuery.find(JSON.parse(queryStr));
		return this;
	}

	sort() {
		const sortBy = this.reqQuery.sort
			? this.reqQuery.sort.split(',').join(' ')
			: '-createdAt';

		this.docQuery = this.docQuery.sort(sortBy);
		return this;
	}

	limitFields() {
		const fields = this.reqQuery.fields
			? this.reqQuery.fields.split(',').join(' ')
			: '-__v';
		this.docQuery = this.docQuery.select(fields);
		return this;
	}

	pagination() {
		const page = Number(this.reqQuery.page) || 1;
		const limit = Number(this.reqQuery.limit) || 10;
		const skip = (page - 1) * limit;

		this.docQuery = this.docQuery.skip(skip).limit(limit);
		return this;
	}
}

module.exports = APIFeatures;
