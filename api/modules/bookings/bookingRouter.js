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

// Not RESTful - should be POST /api/v1/bookings - might consider changing it
router.post("/create_booking", (req, res) => {
	const { user_id, desk_id } = req.body;

	if (!user_id || !desk_id) {
		return res.status(400).json({ error: "Missing user_id or desk_id" });
	}

	const booking = handleCreateBooking({ user_id, desk_id });
	res.status(201).json(booking);
});

router.delete("/delete_booking/:id", (req, res) => {
	const bookingId = Number(req.params.id);
	const { user_id } = req.body;
	const booking = getBookingById(bookingId);

	if (!booking) {
		return res.status(404).json({ error: "Booking not found!" });
	}

	if (user_id && booking.user_id !== user_id) {
		return res
			.status(403)
			.json({ error: "Unauthorized to delete this booking" });
	}

	deleteBookingById(bookingId);
	res.status(204).send();
});

export default router;
