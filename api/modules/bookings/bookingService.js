import { StatusCodes } from "http-status-codes";

import { ApiError } from "../../errors/ApiError.js";

import {
	getAll,
	getOneBookingById,
	deleteOneBookingById,
	isUserBookedOnDate,
	isDeskBookedOnDate,
	createBooking,
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
	return await createBooking({ userId, deskId, date: date });
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
