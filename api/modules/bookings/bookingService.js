import { StatusCodes } from "http-status-codes";

import { ApiError } from "../../Errors/ApiError.js";

import {
	getAll,
	isUserBookedOnDate,
	isDeskBookedOnDate,
	createBooking,
} from "./bookingRepository.js";

export async function getAllBookings() {
	return await getAll();
}

export async function handleCreateBooking({ user_id, desk_id, date }) {
	const bookingDate = date
		? new Date(date).toISOString().slice(0, 10)
		: new Date().toISOString().slice(0, 10);

	if (await isUserBookedOnDate(user_id, bookingDate)) {
		throw new ApiError(
			"User already has a booking for this date.",
			StatusCodes.CONFLICT,
		);
	}

	if (await isDeskBookedOnDate(desk_id, bookingDate)) {
		throw new ApiError(
			"Desk is already booked for this date.",
			StatusCodes.CONFLICT,
		);
	}

	return await createBooking({ user_id, desk_id, date: bookingDate });
}

export async function getBookingById(id) {
	const all = await getAll();
	return all.find((b) => b.booking_id === parseInt(id, 10));
}

export async function deleteBookingById(id) {
	const all = await getAll();
	const index = all.findIndex((b) => b.booking_id === parseInt(id, 10));

	if (index !== -1) {
		all.splice(index, 1);
	} else {
		throw new ApiError("Booking not found!", StatusCodes.NOT_FOUND);
	}
}
