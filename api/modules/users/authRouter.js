import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { ApiError } from "../../errors/ApiError.js";
import config from "../../utils/config.js";

import { handleRegisterUser, handleLogin } from "./userService.js";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	if (
		!firstName?.trim() ||
		!lastName?.trim() ||
		!email?.trim() ||
		!password?.trim()
	) {
		throw new ApiError(
			"Missing firstName, lastName, email, or password",
			StatusCodes.BAD_REQUEST,
		);
	}

	const nameIsValid = (name) => /^[a-zA-Z\s.'-]+$/.test(name);
	if (!nameIsValid(firstName) || !nameIsValid(lastName)) {
		throw new ApiError("Invalid characters in name.", StatusCodes.BAD_REQUEST);
	}

	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			);
	};

	if (!validateEmail(email)) {
		throw new ApiError("Invalid email address.", StatusCodes.BAD_REQUEST);
	}

	if (password.length < 8) {
		throw new ApiError(
			"Password must be at least 8 characters long.",
			StatusCodes.BAD_REQUEST,
		);
	}

	const user = await handleRegisterUser({
		firstName,
		lastName,
		email,
		password,
	});
	res.status(201).json(user);
});

authRouter.post("/login", async (req, res) => {
	const { token } = await handleLogin(req.body);
	res
		.cookie("token", token, {
			httpOnly: true,
			sameSite: "Strict",
			secure: config.production,
			maxAge: 60 * 60 * 1000,
		})
		.json({ token });
});

export default authRouter;
