import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import apiRouter from "./api.js";
import { testConnection } from "./db.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.js";
import config from "./utils/config.js";
import {
	clientRouter,
	configuredHelmet,
	configuredMorgan,
	httpsOnly,
	logErrors,
} from "./utils/middleware.js";

const API_ROOT = "/api";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

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

app.use(errorHandlerMiddleware);

app.use(logErrors());

export default app;
