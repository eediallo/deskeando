import { Router } from "express";

import { getUsers } from "./userService.js";

const router = Router();

router.get("/", async (_, res) => {
	res.send(await getUsers());
});

export default router;
