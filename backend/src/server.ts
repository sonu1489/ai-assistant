import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { runAssistant } from "./services/assistant.service";
import { errorResponse } from "./utils/response";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/*
---------------------------------
 Helmet Security Middleware
---------------------------------
*/
app.use(helmet());

/*
---------------------------------
 Server Health Check Endpoint
---------------------------------
*/

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "ai-support-assistant",
    });
});

/*---------------------------------
 Rate Limiting
---------------------------------
*/
const limiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 10, // max 10 requests per second
    standardHeaders: true,
    legacyHeaders: false,
    message: errorResponse("Too many requests. Please slow down.", ["Rate limit exceeded"])
});

app.use("/api/assistant", limiter);

/*
---------------------------------
API Key Security Middleware
---------------------------------
*/
app.use("/api", (req, res, next) => {

    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json(
            errorResponse("Unauthorized request", ["Invalid or missing API key"])
        );
    }

    next();
});

/*
---------------------------------
Content-Type Validation
---------------------------------
*/
app.use("/api", (req, res, next) => {

    if (req.method === "POST" && req.headers["content-type"] !== "application/json") {
        return res.status(415).json(
            errorResponse("Content-Type must be application/json", ["Invalid content type"])
        );
    }

    next();
});

/*
---------------------------------
Assistant Endpoint
---------------------------------
*/

app.post("/api/assistant", async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json(
                errorResponse("Message is required", ["Invalid request: query missing"])
            );
        }

        const result = await runAssistant(query);
        res.status(200).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json(errorResponse("Internal server error", [message]));
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});