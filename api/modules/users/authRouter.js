import { Router } from "express";

import { handleRegisterUser } from "./userService.js";

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

export default authRouter;
