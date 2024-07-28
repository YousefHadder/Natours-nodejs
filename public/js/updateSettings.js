/* eslint-disable */

// updateData() function
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
	const url = `http://127.0.0.1:8000/api/v1/users/${type === 'password' ? 'updateMyPassword' : 'updateMe'}`;
	try {
		const res = await axios({
			method: 'PATCH',
			url,
			data,
		});
		if (res.data?.status === 'success') {
			showAlert('success', `${type.toUpperCase()} updated successfully!`);
			window.setTimeout(() => {
				location.reload(true);
			}, 1500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};
