exports.getOverviewPage = (req, res) => {
	res.status(200).render('overview', {
		title: 'All Tours',
	});
};

exports.getTourPage = (req, res) => {
	res.status(200).render('tour', {
		title: 'the Forest Hiker',
	});
};
