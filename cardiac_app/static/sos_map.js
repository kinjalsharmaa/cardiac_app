// Initialize the map
const map = L.map('map').setView([0, 0], 13); // Default coordinates

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
}).addTo(map);

// Use Geolocation to get the user's current location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLocation = [position.coords.latitude, position.coords.longitude];

            // Set the map's center to the user's location
            map.setView(userLocation, 15);

            // Add a marker for the user's location
            L.marker(userLocation)
                .addTo(map)
                .bindPopup('You are here')
                .openPopup();

            // Fetch nearby hospitals using Overpass API
            fetchNearbyHospitals(userLocation);
        },
        () => {
            alert('Geolocation failed. Please enable location access.');
        }
    );
} else {
    alert('Geolocation is not supported by this browser.');
}

// Function to fetch nearby hospitals
function fetchNearbyHospitals([lat, lng]) {
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=hospital](around:5000,${lat},${lng});out;`;

    fetch(overpassUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.elements.length === 0) {
                alert('No hospitals found nearby.');
                return;
            }

            data.elements.forEach((element) => {
                const hospitalLocation = [element.lat, element.lon];
                const hospitalName = element.tags.name || 'Unknown Hospital';

                // Add a marker for each hospital
                L.marker(hospitalLocation, { icon: redPinIcon })
                    .addTo(map)
                    .bindPopup(`<strong>${hospitalName}</strong>`);
            });
        })
        .catch((error) => {
            console.error('Error fetching hospital data:', error);
        });
}

// Custom red pin icon for hospitals
const redPinIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

