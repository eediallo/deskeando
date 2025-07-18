import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { ApiError } from "../../errors/ApiError.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

import {
	handleCreateBooking,
	getAllBookings,
	deleteBookingById,
	getBookingById,
} from "./bookingService.js";

const router = Router();

router.get("/", authenticate, async (_, res) => {
	const bookings = await getAllBookings();
	res.json(bookings);
});

router.post("/", authenticate, async (req, res) => {
	const { userId, deskId } = req.body;

	if (!userId || !deskId) {
		throw new ApiError("Missing userId or deskId", StatusCodes.BAD_REQUEST);
	}

	const now = new Date();
	now.setUTCHours(13, 0, 0, 0);
	const bookingDate = now.toISOString();

	const booking = await handleCreateBooking({
		userId: String(userId),
		deskId: String(deskId),
		date: bookingDate,
	});
	res.status(201).json(booking);
});

router.delete("/:id", authenticate, async (req, res) => {
	const bookingId = req.params.id;
	const userId = req.body?.userId;

	const booking = await getBookingById(bookingId);

	if (userId && booking.user_id !== userId) {
		throw new ApiError(
			"Unauthorized to delete this booking",
			StatusCodes.FORBIDDEN,
		);
	}

	await deleteBookingById(bookingId);
	res.status(204).send();
});

export default router;
