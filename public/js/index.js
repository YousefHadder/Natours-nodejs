/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';

// DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

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
