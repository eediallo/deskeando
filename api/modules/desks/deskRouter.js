import { Router } from "express";

import { authenticate } from "../../middlewares/authMiddleware.js";

import { getDesks } from "./deskService.js";

const router = Router();

router.get("/", authenticate, async (_, res) => {
	res.send(await getDesks());
});

export default router;
