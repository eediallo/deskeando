import { bookings } from "../../fixtures/bookings.js";

export function getAll() {
	return bookings;
}

export function getBookingsForDate(date) {
	return bookings.filter((b) => b.from_date.startsWith(date));
}

export function isDeskBookedOnDate(desk_id, date) {
	return getBookingsForDate(date).some((b) => b.desk_id === desk_id);
}

export function isUserBookedOnDate(user_id, date) {
	return getBookingsForDate(date).some((b) => b.user_id === user_id);
}

export function createBooking({ user_id, desk_id, date }) {
	const from_date = new Date(date + "T13:00:00").toISOString();
	const to_date = new Date(date + "T19:00:00").toISOString();

	const booking = {
		booking_id: Math.floor(Math.random() * 1000000),
		user_id,
		desk_id,
		from_date,
		to_date,
	};

	bookings.push(booking);
	return booking;
}
