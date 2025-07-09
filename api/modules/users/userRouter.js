import { Router } from "express";

import { handleRegisterUser, getUsers } from "./userService.js";

const router = Router();

router.get("/", (_, res) => {
	res.send(getUsers());
});

router.post("/register", (req, res) => {
	const { firstName, lastName } = req.body;

	if (!firstName || !lastName) {
		return res.status(400).json({ error: "Missing firstName or lastName" });
	}

	const user = handleRegisterUser({ firstName, lastName });
	res.status(201).json(user);
});

export default router;
