/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup.js';
import { updateSettings } from './updateSettings.js';
import { bookTour } from './stripe.js';
import { showAlert } from './alerts';

// DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

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

bookBtn?.addEventListener('click', async (e) => {
	e.target.textContent = 'Processing...';
	const { tourId } = e.target.dataset;
	await bookTour(tourId);
});

const alertMessage = document.querySelector('body').dataset.alert;

if (alertMessage) {
	showAlert('success', alertMessage, 10);
}
