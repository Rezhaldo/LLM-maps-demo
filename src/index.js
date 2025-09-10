import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path"; // Needed to resolve the openapi.json path
import mapRoutes from "./routes/maps.js";


dotenv.config();
console.log("🔑 Loaded API Key:", process.env.GOOGLE_MAPS_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rete limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use("/api/maps", mapRoutes)

// 🔧 Serve openapi.json so Open WebUI can access it
app.get("/openapi.json", (req, res) => {
    const filePath = path.resolve("openapi.json"); // assumes openapi.json is in the project root
    try {
        const file = fs.readFileSync(filePath, "utf8");
        res.setHeader("Content-Type", "application/json");
        res.send(file);
    } catch (err) {
        console.error("❌ Failed to read openapi.json:", err.message);
        res.status(500).json({ error: "Could not read openapi.json" });
    }
});

app.get("/", (req, res) => {
    res.send("Welcome to the LLM Maps Backend!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})