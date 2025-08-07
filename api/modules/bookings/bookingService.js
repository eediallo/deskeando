import { StatusCodes } from "http-status-codes";

import { ApiError } from "../../errors/ApiError.js";

import {
	getAll,
	getOneBookingById,
	deleteOneBookingById,
	isUserBookedOnDate,
	isDeskBookedOnDate,
	createBooking,
	getFilteredBookings,
	getBookingsForUser,
	getBookingsbyDesk,
} from "./bookingRepository.js";

export async function getAllBookings() {
	return await getAll();
}

export async function handleCreateBooking({ userId, deskId, date }) {
	if (await isUserBookedOnDate(userId, date)) {
		throw new ApiError(
			"User already has a booking for this date.",
			StatusCodes.CONFLICT,
		);
	}

	if (await isDeskBookedOnDate(deskId, date)) {
		throw new ApiError(
			"Desk is already booked for this date.",
			StatusCodes.CONFLICT,
		);
	}

	const booking = await createBooking({ userId, deskId, date: date });

	// If createBooking returns null, it means there was a conflict
	if (!booking) {
		throw new ApiError(
			"Desk is already booked for this date or time range.",
			StatusCodes.CONFLICT,
		);
	}

	return booking;
}

export async function getBookingById(id) {
	const booking = await getOneBookingById(id);
	if (!booking) {
		throw new ApiError("Booking not found", StatusCodes.NOT_FOUND);
	}
	return booking;
}

export async function deleteBookingById(id) {
	const deleted = await deleteOneBookingById(id);
	if (!deleted) {
		throw new ApiError(
			"Booking not found or already deleted",
			StatusCodes.NOT_FOUND,
		);
	}
	return deleted;
}

export async function getFilteredBookingsService({ from, to, userId }) {
	return await getFilteredBookings({ from, to, userId });
}

export async function getBookingsForUserSplit(userId) {
	const all = await getBookingsForUser(userId);
	const now = new Date();
	const upcoming = [];
	const past = [];
	for (const b of all) {
		const bookingDate = new Date(b.from_date);
		if (bookingDate >= now) {
			upcoming.push(b);
		} else {
			past.push(b);
		}
	}
	return { past, upcoming };
}

export async function getBookingsbyDeskId(deskId) {
	const bookings = await getBookingsbyDesk(deskId);
	if (!bookings) {
		throw new ApiError(
			"Failed to fetch bookings",
			StatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
	return bookings;
}
