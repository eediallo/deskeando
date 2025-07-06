import { Router } from "express";

import { handleCreateUser } from "./userService.js";
const router = Router();

router.post("/", (req, res) => {
	const { firstName, lastName } = req.body;
	if (!firstName || !lastName) {
		return res.status(400).json({ error: "Missing firstName or lastName" });
	}
	const user = handleCreateUser({ firstName, lastName });

	res.status(201).json(user);
});

export default router;
