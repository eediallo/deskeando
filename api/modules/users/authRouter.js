import { Router } from "express";

import config from "../../utils/config.js";

import { handleRegisterUser, handleLogin } from "./userService.js";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	if (
		!firstName.trim() ||
		!lastName.trim() ||
		!email.trim() ||
		!password.trim()
	) {
		return res
			.status(400)
			.json({ error: "Missing firstName, lastName, email, or password" });
	}

	const nameIsValid = (name) => /^[a-zA-Z\s.'-]+$/.test(name);
	if (!nameIsValid(firstName) || !nameIsValid(lastName)) {
		return res.status(400).json({ error: "Invalid characters in name." });
	}

	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			);
	};

	if (!validateEmail(email)) {
		return res.status(400).json({ error: "Invalid email address." });
	}

	if (password.length < 8) {
		return res
			.status(400)
			.json({ error: "Password must be at least 8 characters long." });
	}

	try {
		const user = await handleRegisterUser({
			firstName,
			lastName,
			email,
			password,
		});
		res.status(201).json(user);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
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
