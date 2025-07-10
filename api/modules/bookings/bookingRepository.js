import { bookings } from "../../fixtures/bookings.js";

export function getAll() {
	return bookings;
}

export function getBookingsForDate(date) {
	return bookings.filter((b) => b.fromDate.startsWith(date));
}

export function isDeskBookedOnDate(deskId, date) {
	return getBookingsForDate(date).some((b) => b.deskId === String(deskId));
}

export function isUserBookedOnDate(userId, date) {
	return getBookingsForDate(date).some((b) => b.userId === String(userId));
}

export function createBooking({ userId, deskId, date }) {
	const fromDate = new Date(date + "T13:00:00").toISOString();
	const toDate = new Date(date + "T19:00:00").toISOString();

	const booking = {
		id: String(Math.floor(Math.random() * 1000000)),
		userId: String(userId),
		deskId: String(deskId),
		fromDate,
		toDate,
	};

	bookings.push(booking);
	return booking;
}
