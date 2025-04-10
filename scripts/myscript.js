// Initialize the map and set its view
var map = L.map('map').setView([35.0844, -106.6504], 13); // Centered on Albuquerque, NM

// Add the tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Add a marker to the map
L.marker([35.0844, -106.6504]).addTo(map)
    .bindPopup('Welcome to Albuquerque!')
    .openPopup();
