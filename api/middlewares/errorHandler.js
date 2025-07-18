import { StatusCodes } from "http-status-codes";

import { ApiError } from "../errors/ApiError.js";

/* eslint-disable-next-line no-unused-vars */
export const errorHandlerMiddleware = (err, req, res, _next) => {
	let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
	let message = "Something went wrong. Please try again later.";

	if (err instanceof ApiError) {
		statusCode = err.statusCode;
		message = err.message;
	}

	// eslint-disable-next-line no-console
	console.error(`[Error] ${err.name}: ${err.message}`);

	res.status(statusCode).json({ error: message });
};
