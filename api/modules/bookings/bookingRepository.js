import { bookings } from "../../fixtures/bookings.js";

export async function getAll() {
	return bookings;
}

export async function getBookingsForDate(date) {
	return bookings.filter((b) => b.from_date.startsWith(date));
}

export async function isDeskBookedOnDate(desk_id, date) {
	const dateBookings = await getBookingsForDate(date);
	return dateBookings.some((b) => b.desk_id === desk_id);
}

export async function isUserBookedOnDate(user_id, date) {
	const dateBookings = await getBookingsForDate(date);
	return dateBookings.some((b) => b.user_id === user_id);
}

export async function createBooking({ user_id, desk_id, date }) {
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
