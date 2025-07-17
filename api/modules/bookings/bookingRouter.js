import { Router } from "express";

import { authenticate } from "../../middlewares/authMiddleware.js";

import {
	handleCreateBooking,
	getAllBookings,
	deleteBookingById,
	getBookingById,
} from "./bookingService.js";

const router = Router();

router.get("/", authenticate, async (_, res) => {
	res.send(await getAllBookings());
});

router.post("/", authenticate, async (req, res) => {
	const { userId, deskId } = req.body;

	if (!userId || !deskId) {
		return res.status(400).json({ error: "Missing userId or deskId" });
	}

	try {
		const now = new Date();
		now.setUTCHours(13, 0, 0, 0);
		const bookingDate = now.toISOString();

		const booking = await handleCreateBooking({
			userId: String(userId),
			deskId: String(deskId),
			date: bookingDate,
		});
		res.status(201).json(booking);
	} catch (err) {
		const status = err.status || 400;
		res.status(status).json({ error: err.message });
	}
});

router.delete("/:id", authenticate, async (req, res) => {
	const bookingId = req.params.id;
	const userId = req.body?.userId;
	try {
		const booking = await getBookingById(bookingId);

		if (!booking) {
			return res.status(404).json({ error: "Booking not found!" });
		}

		if (userId && booking.user_id !== userId) {
			return res
				.status(403)
				.json({ error: "Unauthorized to delete this booking" });
		}

		const deleted = await deleteBookingById(bookingId);
		if (!deleted) {
			return res
				.status(404)
				.json({ error: "Booking not found or already deleted!" });
		}
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
