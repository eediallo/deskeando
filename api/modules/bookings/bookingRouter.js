import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { ApiError } from "../../errors/ApiError.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

import {
	handleCreateBooking,
	getAllBookings,
	deleteBookingById,
	getBookingById,
	getFilteredBookingsService,
	getBookingsForUserSplit,
	getBookingsbyDeskId,
} from "./bookingService.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
	const { from, to, userId } = req.query;
	if (from || to || userId) {
		const bookings = await getFilteredBookingsService({ from, to, userId });
		return res.json(bookings);
	}
	const bookings = await getAllBookings();
	res.json(bookings);
});

router.post("/", authenticate, async (req, res) => {
	const { userId, deskId, bookingDate } = req.body;

	if (!userId || !deskId) {
		throw new ApiError("Missing userId or deskId", StatusCodes.BAD_REQUEST);
	}

	const bookingDateObj = new Date(bookingDate);
	bookingDateObj.setUTCHours(13, 0, 0, 0);
	const bookingDateISO = bookingDateObj.toISOString();

	const booking = await handleCreateBooking({
		userId: String(userId),
		deskId: String(deskId),
		date: bookingDateISO,
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

// Get current user's bookings (past & upcoming)
router.get("/my", authenticate, async (req, res) => {
	const userId = req.user?.id;
	if (!userId) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ error: "Not authenticated" });
	}
	const result = await getBookingsForUserSplit(userId);
	res.json(result);
});

export default router;

// Get bookings for a specific desk by Id
router.get("/desk/:deskId", authenticate, async (req, res) => {
	const { deskId } = req.params;

	if (!deskId) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: "Missing desk id" });
	}

	const bookings = await getBookingsbyDeskId(deskId);
	res.json(bookings);
});
