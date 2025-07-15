import { Router } from "express";

import config from "../../utils/config.js";

import { handleRegisterUser, handleLogin } from "./userService.js";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	if (!firstName || !lastName || !email || !password) {
		return res
			.status(400)
			.json({ error: "Missing firstName, lastName, email, or password" });
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
