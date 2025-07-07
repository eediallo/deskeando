import { Router } from "express";

import { handleCreateBooking } from "./bookingService.js";

const router = Router();

// Not RESTful - should be POST /api/v1/bookings - might consider changing it
router.post("/create_booking", (req, res) => {
	const { user_id, desk_id } = req.body;

	if (!user_id || !desk_id) {
		return res.status(400).json({ error: "Missing user_id or desk_id" });
	}

	const booking = handleCreateBooking({ user_id, desk_id });
	res.status(201).json(booking);
});

export default router;
