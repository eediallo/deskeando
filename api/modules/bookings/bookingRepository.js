import { bookings } from "../../fixtures/bookings.js";

export function getAll() {
	return bookings;
}

export function getBookingsForDate(date) {
	return bookings.filter((b) => b.fromDate.startsWith(date));
}

export function isDeskBookedOnDate(deskId, date) {
	return getBookingsForDate(date).some((b) => b.deskId === deskId);
}

export function isUserBookedOnDate(userId, date) {
	return getBookingsForDate(date).some((b) => b.userId === userId);
}

export function createBooking({ userId, deskId, date }) {
	const fromDate = new Date(date + "T13:00:00").toISOString();
	const toDate = new Date(date + "T19:00:00").toISOString();

	const booking = {
		id: Math.floor(Math.random() * 1000000),
		userId,
		deskId,
		fromDate,
		toDate,
	};

	bookings.push(booking);
	return booking;
}
