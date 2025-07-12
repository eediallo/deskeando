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
		const error = new Error("User already has a booking for this date.");
		error.status = 409;
		throw error;
	}

	if (await isDeskBookedOnDate(deskId, date)) {
		const error = new Error("Desk is already booked for this date.");
		error.status = 409;
		throw error;
	}
	return await createBooking({ userId, deskId, date: date });
}

export async function getBookingById(id) {
	return await getOneBookingById(id);
}

export async function deleteBookingById(id) {
	return await deleteOneBookingById(id);
}
