import { Router } from "express";

import { authenticate } from "../../middlewares/authMiddleware.js";

import { getUsers } from "./userService.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
	const users = await getUsers();
	res.send(users);
});

export default router;
