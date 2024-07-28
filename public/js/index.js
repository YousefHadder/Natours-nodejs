/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings.js';
// DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const passowrdForm = document.querySelector('.form-user-password');

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

logoutBtn?.addEventListener('click', (e) => {
	e.preventDefault();
	logout();
});

userDataForm?.addEventListener('submit', (e) => {
	e.preventDefault();
	const name = document.getElementById('name').value;
	const email = document.getElementById('email').value;
	updateSettings({ name, email }, 'data');
});

passowrdForm?.addEventListener('submit', async (e) => {
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
