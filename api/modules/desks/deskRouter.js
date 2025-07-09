import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { asyncWrapper } from "../../middlewares/asyncWrapper.js";

import { getDesks } from "./deskService.js";

const router = Router();

router.get(
	"/",
	asyncWrapper(async (_, res) => {
		const desks = await getDesks();
		if (desks.length === 0) {
			return res.sendStatus(StatusCodes.NO_CONTENT);
		}
		res.status(StatusCodes.OK).send(desks);
	}),
);

export default router;
