const API_BASE = "http://localhost:5000/api/maps";

async function searchPlaces() {
    const query = document.getElementById("searchInput").value;
    if (!query) return alert("Please enter a search query.");

    const res = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    renderMap(data);
}


async function getDirections() {
    const origin = document.getElementById("originInput").value;
    const destination = document.getElementById("destinationInput").value;
    if (!origin || !destination) return alert("Please enter both origin and destination.");

    const res = await fetch(`${API_BASE}/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
    const data = await res.json();

    renderMap(data);
}

function renderMap(data) {
    if (data.embedLink) {
        const iframe = document.createElement("iframe");
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.frameBorder = "0";
        iframe.src = data.embedLink;

        const mapContainer = document.getElementById("map");
        mapContainer.innerHTML = "";
        mapContainer.appendChild(iframe);

        document.getElementById("mapLink").innerHTML =
            `<a href="${data.googleMapsLink}" target="_blank">Open in Google Maps</a>`;
    } else {
        alert("No results found.");
    }
}