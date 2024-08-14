/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup.js';
import { updateSettings } from './updateSettings.js';
import { bookTour } from './stripe.js';
import { showAlert } from './alerts';
import { createReview } from './review.js';

// DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const reviewForm = document.querySelector('.form--review');
const userDataForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-password');

const bookBtn = document.getElementById('book-tour');
const tourDateSelect = document.getElementById('tourDate');

const ratingInputs = document.querySelectorAll('#rating input');

let selectedRating = 0;
ratingInputs.forEach((input) => {
	input.addEventListener('change', function () {
		selectedRating = parseInt(this.value);
	});
});

if (bookBtn) {
	bookBtn.disabled = true;
}
// DELEGATION
if (mapbox) {
	const locations = JSON.parse(
		document.getElementById('map').dataset.locations,
	);
	displayMap(locations);
}

loginForm?.addEventListener('submit', (e) => {
	e.preventDefault();
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	login(email, password);
});

signupForm?.addEventListener('submit', (e) => {
	e.preventDefault();
	const name = document.getElementById('name').value;
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const passwordConfirm = document.getElementById('passwordConfirm').value;
	signup(name, email, password, passwordConfirm);
});

reviewForm?.addEventListener('submit', async (e) => {
	e.preventDefault();
	const review = document.getElementById('review').value;
	const rating = document.querySelector('input[name="rating"]:checked').value;
	const { tourSlug } = e.target.dataset;
	const { tourId } = e.target.dataset;
	await createReview(review, rating, tourSlug, tourId);
});

logoutBtn?.addEventListener('click', (e) => {
	e.preventDefault();
	logout();
});

userDataForm?.addEventListener('submit', async (e) => {
	e.preventDefault();
	const form = new FormData();
	form.append('name', document.getElementById('name').value);
	form.append('email', document.getElementById('email').value);
	form.append('photo', document.getElementById('photo').files[0]);
	await updateSettings(form, 'data');
});

passwordForm?.addEventListener('submit', async (e) => {
	e.preventDefault();
	document.querySelector('.btn--save-password').textContent = 'Updating...';

	const passwordCurrent = document.getElementById('password-current').value;
	const password = document.getElementById('password').value;
	const passwordConfirm = document.getElementById('password-confirm').value;
	await updateSettings(
		{ passwordCurrent, password, passwordConfirm },
		'password',
	);
	document.querySelector('.btn--save-password').textContent = 'Save password';

	// Reset form inputs
	document.getElementById('password-current').value = '';
	document.getElementById('password').value = '';
	document.getElementById('password-confirm').value = '';
});

tourDateSelect?.addEventListener('change', () => {
	if (tourDateSelect.value) {
		bookBtn.disabled = false;
	} else {
		bookBtn.disabled = true;
	}
});

bookBtn?.addEventListener('click', async (e) => {
	e.target.textContent = 'Processing...';
	const { tourId } = e.target.dataset;
	const selectedDate = tourDateSelect.value;
	await bookTour(tourId, selectedDate);
});

const alertMessage = document.querySelector('body').dataset.alert;

if (alertMessage) {
	showAlert('success', alertMessage, 10);
}
