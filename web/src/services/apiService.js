/*
const API_BASE_URL = "/api/v1";

export async function getUsers() {
	// API call temporarily commented out
	const response = await fetch(`${API_BASE_URL}/users`);
	if (!response.ok) {
		throw new Error("Failed to fetch users");
	}
	return response.json();
}

export async function getDesks() {
	// API call temporarily commented out
	const response = await fetch(`${API_BASE_URL}/desks`);
	if (!response.ok) {
		throw new Error("Failed to fetch desks");
	}
	return response.json();
}

export async function getBookings() {
	// API call temporarily commented out
	// const response = await fetch(`${API_BASE_URL}/bookings`);
	// if (!response.ok) {
	// 	throw new Error("Failed to fetch bookings");
	// }
	// return response.json();
}

export async function createBooking(bookingData) {
	// API call temporarily commented out
	const response = await fetch(`${API_BASE_URL}/bookings/create_booking`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(bookingData),
	});
	if (!response.ok) {
		throw new Error("Failed to create booking");
	}
	return response.json();
}

export async function deleteBooking(bookingId) {
	// API call temporarily commented out
	const response = await fetch(
		`${API_BASE_URL}/bookings/delete_booking/${bookingId}`,
		{
			method: "DELETE",
		},
	);
	if (!response.ok) {
		throw new Error("Failed to delete booking");
	}
	return response.json();
}

*/
