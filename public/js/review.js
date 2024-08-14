/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createReview = async (review, rating, tourSlug, tourId) => {
	try {
		const res = await axios({
			method: 'POST',
			url: `/api/v1/reviews/`,
			data: {
				review,
				rating,
				tour: tourId,
			},
		});
		if (res.data?.status === 'success') {
			showAlert('success', 'Review created successfully!');
			window.setTimeout(() => {
				location.assign(`/tour/${tourSlug}`);
			}, 1500);
		}
	} catch (err) {
		showAlert('error', 'Error creating review. Please try again later.');
	}
};
