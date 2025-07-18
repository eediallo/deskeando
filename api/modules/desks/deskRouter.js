import { Router } from "express";

import { authenticate } from "../../middlewares/authMiddleware.js";

import { getDesks } from "./deskService.js";

const router = Router();

router.get("/", authenticate, async (_, res) => {
	try {
		const desks = await getDesks();
		res.json(desks);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.log(err);
		res.status(500).json({ error: "Failed to load desks" });
	}
});

export default router;
