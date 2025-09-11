import axios from "axios";

// Search places
export const searchPlaces = async (query, location = "Jakarta", radius = 5000) => {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
    const params = { query, location, radius, key: API_KEY };

    try {
        const response = await axios.get(url, { params });

        let embedLink = null;
        let googleMapsLink = null;

        if (response.data.results?.length > 0) {
            const places = response.data.results.slice(0, 1).map(place => ({
                name: place.name,
                address: place.formatted_address,
                rating: place.rating,
                totalReviews: place.user_ratings_total,
                googleMapsLink: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
            }));

            const first = response.data.results[0];
            const loc = first.geometry.location;

            embedLink = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${loc.lat},${loc.lng}`;
            googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;

            return {
                embedLink,
                googleMapsLink,
                places
            };
        }


    } catch (err) {
        console.error("searchPlaces error:", err.message);
        return { embedLink: null, googleMapsLink: null };
    }
};

// Get directions
export const getDirections = async (origin, destination) => {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/directions/json`;
    const params = { origin, destination, key: API_KEY };

    try {
        const response = await axios.get(url, { params });

        let embedLink = null;
        let googleMapsLink = null;

        if (response.data.routes?.length > 0) {
            const start = response.data.routes[0].legs[0].start_location;
            const end = response.data.routes[0].legs[0].end_location;

            embedLink = `https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}`;
            googleMapsLink = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
        }

        return {
            embedLink,
            googleMapsLink,
        };
    } catch (err) {
        console.error("getDirections error:", err.message);
        return { embedLink: null, googleMapsLink: null };
    }
};
