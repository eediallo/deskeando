import { Router } from "express";

import { getUsers } from "./userService.js";

const router = Router();

router.get("/", (_, res) => {
	res.send(getUsers());
});

export default router;
