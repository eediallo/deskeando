import { Router } from "express";

import { getDesks } from "./deskService.js";

const router = Router();

router.get("/", (_, res) => {
	res.send(getDesks());
});

export default router;
