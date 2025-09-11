import express from "express";
import { getDirections, searchPlaces } from "../services/googleMaps.js";

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

router.get("/directions", async (req, res) => {
    try {
        const { origin, destination } = req.query;
        if (!origin || !destination) {
            return res.status(400).json({ error: "Origin and destination parameters are required" });
        }

        const results = await getDirections(origin, destination);
        res.json(results);
    } catch (error) {
        console.error("❌ /directions failed:", error.message);
        res.status(500).json({ error: "Failed to fetch directions" });
    }
});


export default router;