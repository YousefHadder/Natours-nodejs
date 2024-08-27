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
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const reviewForm = document.querySelector('.form--review');
const userDataForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-password');

const logoutBtn = document.querySelector('.nav__el--logout');
const closeModalBtn = document.querySelector('.close-modal');

const openModalBtn = document.getElementById('open-modal');
const bookBtn = document.getElementById('book-tour');

const mapbox = document.getElementById('map');
const tourDateSelect = document.getElementById('tourDate');

const ratingInputs = document.querySelectorAll('#rating input');

let selectedRating = 0;

ratingInputs.forEach((input) => {
	input.addEventListener('change', function () {
		selectedRating = parseInt(this.value);
	});
});

const openModal = function () {
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
	document.body.classList.add('no-scroll'); // Disable scrolling
};

const closeModal = function () {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
	document.body.classList.remove('no-scroll'); // Enable scrolling
};

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

openModalBtn?.addEventListener('click', function () {
	openModal();
});

closeModalBtn?.addEventListener('click', function () {
	closeModal();
});

overlay?.addEventListener('click', function () {
	closeModal();
});

document.addEventListener('keydown', function (e) {
	// console.log(e.key);

	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	}
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
