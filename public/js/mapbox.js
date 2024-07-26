/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
	'pk.eyJ1IjoieW91c2VmaGFkZGVyIiwiYSI6ImNsejMxNGh2YTI1a20yanB5dWxndnB5ZHEifQ.cSuUDXZ7470G_5felNhQSg';

let map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/yousefhadder/clz32uj6502kb01qohqn4ekv9',
	scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
	// Create marker
	const el = document.createElement('div');
	el.className = 'marker';
	// Add marker
	new mapboxgl.Marker({
		element: el,
		anchor: 'bottom',
	})
		.setLngLat(loc.coordinates)
		.addTo(map);
	// Add popup
	new mapboxgl.Popup({
		offset: 40,
	})
		.setLngLat(loc.coordinates)
		.setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
		.addTo(map);

	// Add marker to bounds
	bounds.extend(loc.coordinates);
	// Extends maps bounds to include current location
	bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
	padding: {
		top: 200,
		bottom: 150,
		left: 100,
		right: 100,
	},
});
