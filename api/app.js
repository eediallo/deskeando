// For __dirname in ES modules
import path from "path";
import { fileURLToPath } from "url";

import express from "express";

import apiRouter from "./api.js";
import { testConnection } from "./db.js";
import config from "./utils/config.js";
import {
	clientRouter,
	configuredHelmet,
	configuredMorgan,
	httpsOnly,
	logErrors,
} from "./utils/middleware.js";

const API_ROOT = "/api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// Serve the Redoc API docs HTML directly at /api/docs
app.get("/api/docs", (req, res) => {
	res.sendFile(path.resolve(__dirname, "static/api-docs.html"));
});

app.use(configuredHelmet());
app.use(configuredMorgan());

if (config.production && config.forceHttps) {
	app.enable("trust proxy");
	app.use(httpsOnly());
}

app.get("/healthz", async (_, res) => {
	await testConnection();
	res.sendStatus(200);
});

app.use(API_ROOT, apiRouter);

app.use(clientRouter(API_ROOT));

app.use(logErrors());

export default app;
