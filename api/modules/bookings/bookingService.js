import {
	getAll,
	isUserBookedOnDate,
	isDeskBookedOnDate,
	createBooking,
} from "./bookingRepository.js";

export function getAllBookings() {
	return getAll();
}

export function handleCreateBooking({ user_id, desk_id, date }) {
	const bookingDate = date
		? new Date(date).toISOString().slice(0, 10)
		: new Date().toISOString().slice(0, 10);

	if (isUserBookedOnDate(user_id, bookingDate)) {
		throw new Error("User already has a booking for this date.");
	}
	if (isDeskBookedOnDate(desk_id, bookingDate)) {
		throw new Error("Desk is already booked for this date.");
	}
	return createBooking({ user_id, desk_id, date: bookingDate });
}

export function getBookingById(id) {
	return getAll().find((b) => b.id === parseInt(id, 10));
}

export function deleteBookingById(id) {
	const index = getAll().findIndex((b) => b.id === parseInt(id, 10));
	if (index !== -1) {
		getAll().splice(index, 1);
	} else {
		throw new Error("Booking not found!");
	}
}
