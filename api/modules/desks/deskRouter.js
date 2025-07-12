import { Router } from "express";

import { getDesks } from "./deskService.js";

const router = Router();

router.get("/", async (_, res) => {
	res.send(await getDesks());
});

export default router;
