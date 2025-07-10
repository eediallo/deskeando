import {
	getAll,
	isUserBookedOnDate,
	isDeskBookedOnDate,
	createBooking,
} from "./bookingRepository.js";

export function getAllBookings() {
	return getAll();
}

export function handleCreateBooking({ userId, deskId, date }) {
	const bookingDate = date
		? new Date(date).toISOString().slice(0, 10)
		: new Date().toISOString().slice(0, 10);

	if (isUserBookedOnDate(userId, bookingDate)) {
		const error = new Error("User already has a booking for this date.");
		error.status = 409;
		throw error;
	}
	if (isDeskBookedOnDate(deskId, bookingDate)) {
		const error = new Error("Desk is already booked for this date.");
		error.status = 409;
		throw error;
	}
	return createBooking({ userId, deskId, date: bookingDate });
}

export function getBookingById(id) {
	return getAll().find((b) => b.id === id);
}

export function deleteBookingById(id) {
	const index = getAll().findIndex((b) => b.id === id);
	if (index !== -1) {
		getAll().splice(index, 1);
	} else {
		throw new Error("Booking not found!");
	}
}
