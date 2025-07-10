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

export async function handleCreateBooking({ user_id, desk_id, date }) {
	const bookingDate = date
		? new Date(date).toISOString().slice(0, 10)
		: new Date().toISOString().slice(0, 10);

	if (isUserBookedOnDate(user_id, bookingDate)) {
		throw new Error("User already has a booking for this date.");
	}
	if (isDeskBookedOnDate(desk_id, bookingDate)) {
		throw new Error("Desk is already booked for this date.");
	}
	return await createBooking({ user_id, desk_id, date: bookingDate });
}

export async function getBookingById(id) {
	return await getOneBookingById(id);
}

export async function deleteBookingById(id) {
	return await deleteOneBookingById(id);
}
