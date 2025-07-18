import { Router } from "express";

import { authenticate } from "../../middlewares/authMiddleware.js";

import { getUsers } from "./userService.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
	try {
		const users = await getUsers();
		res.json(users);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.log(err);
		res.status(500).json({ error: "Failed to fetch users" });
	}
});

export default router;
