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
	const bookingDate = date
		? new Date(date).toISOString().slice(0, 10)
		: new Date().toISOString().slice(0, 10);

	if (await isUserBookedOnDate(userId, bookingDate)) {
		const error = new Error("User already has a booking for this date.");
		error.status = 409;
		throw error;
	}
	if (await isDeskBookedOnDate(deskId, bookingDate)) {
		const error = new Error("Desk is already booked for this date.");
		error.status = 409;
		throw error;
	}
	return await createBooking({ userId, deskId, date: bookingDate });
}

export async function getBookingById(id) {
	return await getOneBookingById(id);
}

export async function deleteBookingById(id) {
	return await deleteOneBookingById(id);
}
