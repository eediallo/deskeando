import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { ApiError } from "../../Errors/ApiError.js";
import { asyncWrapper } from "../../middlewares/asyncWrapper.js";

import {
	handleCreateBooking,
	getAllBookings,
	deleteBookingById,
	getBookingById,
} from "./bookingService.js";

const router = Router();

router.get(
	"/",
	asyncWrapper(async (_, res) => {
		const bookings = await getAllBookings();
		res.status(StatusCodes.OK).json(bookings);
	}),
);

router.post(
	"/create_booking",
	asyncWrapper(async (req, res) => {
		const { user_id, desk_id, date } = req.body;

		if (!user_id || !desk_id) {
			throw new ApiError("Missing user_id or desk_id", StatusCodes.BAD_REQUEST);
		}

		const booking = await handleCreateBooking({ user_id, desk_id, date });
		res.status(StatusCodes.CREATED).json(booking);
	}),
);

router.delete(
	"/delete_booking/:id",
	asyncWrapper(async (req, res) => {
		const bookingId = Number(req.params.id);
		if (isNaN(bookingId)) {
			throw new ApiError("Invalid booking ID", StatusCodes.BAD_REQUEST);
		}

		const { user_id } = req.body;

		const booking = await getBookingById(bookingId);
		if (!booking) {
			throw new ApiError("Booking not found!", StatusCodes.NOT_FOUND);
		}

		if (user_id && booking.user_id !== user_id) {
			throw new ApiError(
				"Unauthorized to delete this booking",
				StatusCodes.FORBIDDEN,
			);
		}

		await deleteBookingById(bookingId);
		res.status(StatusCodes.NO_CONTENT).send();
	}),
);

export default router;
