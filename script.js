`
Features id like to add sometime soon:
1. little planes and arcs showing the current location and final destination
2. Make better ui
3. 

`

const map = L.map('map').setView([20, 0], 2); // Map centre for ease
let flightMarkers = [];

// OpenStreetMap base map 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    attribution: '© OpenStreetMap'
}).addTo(map);

// fetching flight data from OpenSky
async function flightdata() {
    try {
        const response = await fetch('https://opensky-network.org/api/states/all');

        //using The OpenSky Network, https://opensky-network.org

        const data = await response.json();

        const flights = data.states;

        flights.forEach(flight => {
            const [icao24, callsign, originCountry, timePosition, lastContact, lon, lat, baroAlt, onGround, velocity] = flight;

            if (lat !== null && lon !== null) {

                const marker = L.circleMarker([lat, lon], {
                    radius: 4,
                    color: onGround ? "gray" : "red"
                }).addTo(map);

                const datapopup = `
          <strong>Callsign:</strong> ${callsign || 'N/A'}<br/>
          <strong>Country:</strong> ${originCountry}<br/>
          <strong>Velocity:</strong> ${velocity ? velocity.toFixed(1) + ' m/s' : 'N/A'}
        `;

                marker.bindPopup(datapopup);

                // save marker and callsign for searching
                flightMarkers.push({ marker, callsign: (callsign || '').trim() });
            }
        });
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

function searchFlights() {

    const query = document.getElementById('FlightName').value.trim().toUpperCase();

    flightMarkers.forEach(({ marker, callsign }) => {

        if (callsign && callsign.includes(query)) {

            marker.openPopup(); // Show the popup
            map.setView(marker.getLatLng(), 6); // Zoom to flight
        }
    });
}

flightdata();
