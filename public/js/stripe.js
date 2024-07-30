/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
	try {
		const stripe = Stripe(
			'pk_test_51Pi3Nf2K5p2OrSLTMSPEMvVjBkSRWGG7xS6xfs0aa8QPu20GqePcucKWs1A4A31VqHaveNnyxpaxEBF9k5sp4YCS00wI6R5BbA',
		);
		// 1) Get checkout session from API
		const session = await axios(
			`/api/v1/bookings/checkout-session/${tourId}`,
		);
		// 2) Create checkout form + charge credit card
		const checkoutPageUrl = session.data.session.url;
		window.location.assign(checkoutPageUrl);
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};
