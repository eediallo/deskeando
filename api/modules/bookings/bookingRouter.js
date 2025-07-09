import { Router } from "express";

import {
	handleCreateBooking,
	getAllBookings,
	deleteBookingById,
	getBookingById,
} from "./bookingService.js";

const router = Router();

router.get("/", (_, res) => {
	res.send(getAllBookings());
});

router.post("/", (req, res) => {
	const { userId, deskId } = req.body;

	if (!userId || !deskId) {
		return res.status(400).json({ error: "Missing userId or deskId" });
	}

	try {
		const booking = handleCreateBooking({ userId, deskId });
		res.status(201).json(booking);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.delete("/:id", (req, res) => {
	const bookingId = Number(req.params.id);
	const { userId } = req.body;
	const booking = getBookingById(bookingId);

	if (!booking) {
		return res.status(404).json({ error: "Booking not found!" });
	}

	if (userId && booking.userId !== userId) {
		return res
			.status(403)
			.json({ error: "Unauthorized to delete this booking" });
	}

	deleteBookingById(bookingId);
	res.status(204).send();
});

export default router;
