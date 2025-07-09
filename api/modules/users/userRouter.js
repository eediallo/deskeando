import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { ApiError } from "../../Errors/ApiError.js";
import { asyncWrapper } from "../../middlewares/asyncWrapper.js";

import { handleRegisterUser, getUsers } from "./userService.js";

const router = Router();

router.get(
	"/",
	asyncWrapper(async (_, res) => {
		const users = await getUsers();
		res.status(StatusCodes.OK).json(users);
	}),
);

router.post(
	"/register_user",
	asyncWrapper(async (req, res) => {
		const first = req.body.firstName?.trim();
		const last = req.body.lastName?.trim();

		if (!first || !last) {
			throw new ApiError(
				"Invalid input: firstName and lastName are required.",
				StatusCodes.BAD_REQUEST,
			);
		}

		const user = await handleRegisterUser({ firstName: first, lastName: last });

		res.status(StatusCodes.CREATED).json(user);
	}),
);

export default router;
