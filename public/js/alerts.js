/* eslint-disable */

export const hideAlert = () => {
	const el = document.querySelector('.alert');
	el?.parentElement.removeChild(el);
};

// Type is 'success' or 'error
export const showAlert = (type, message) => {
	hideAlert();
	const markup = `<div class="alert alert--${type}">${message}</div>`;
	document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
	window.setTimeout(hideAlert, 5000);
};
