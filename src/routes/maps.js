import express from "express";
import { searchPlaces } from "../services/googleMaps.js";

const router = express.Router();

// Search places endpoint
router.get("/search", async (req, res) => {
    try {
        const { query, location, radius } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }
        const results = await searchPlaces(query, location, radius);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Failed to search places" });
    }
});

// Get directions endpoint

async function geocodeAddress(address, apiKey) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
        return data.results[0].geometry.location; // { lat, lng }
    }
    throw new Error("Geocoding failed");

}

router.get("/directions", async (req, res) => {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
        return res.status(400).json({ error: "Origin and destination parameters are required" });
    }


    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        // Step 1: Convert origin & destination to lat,lng
        const originCoords = await geocodeAddress(origin, apiKey);
        const destinationCoords = await geocodeAddress(destination, apiKey);

        // Step 2: Directions API (optional details like steps)
        const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${originCoords.lat},${originCoords.lng}&destination=${destinationCoords.lat},${destinationCoords.lng}&key=${apiKey}`;
        const response = await fetch(directionsUrl);
        const directions = await response.json();

        if (!directions.routes || directions.routes.length === 0) {
            return res.json({ error: "No directions found" });
        }

        // Step 3: Return links (with coordinates)
        return res.json({
            googleMapsLink: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`,
            embedLink: `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${originCoords.lat},${originCoords.lng}&destination=${destinationCoords.lat},${destinationCoords.lng}`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch directions" });
    }
});

export default router;