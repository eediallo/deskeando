const API_BASE_URL = "/api/v1";

export async function registerUser(userData) {
	const response = await fetch(`${API_BASE_URL}/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userData),
		credentials: "include",
	});
	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.error || "Registration failed");
	}
	return response.json();
}

export async function loginUser({ email, password }) {
	const response = await fetch(`${API_BASE_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
		credentials: "include",
	});
	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.error || "Login failed");
	}
	return response.json();
}

export async function getUsers() {
	const response = await fetch(`${API_BASE_URL}/users`, {
		credentials: "include",
	});
	if (!response.ok) {
		throw new Error("Failed to fetch users");
	}
	const data = await response.json();
	return data;
}

export async function getCurrentUser() {
	const response = await fetch("/api/v1/me", { credentials: "include" });
	if (!response.ok) {
		throw new Error("Not authenticated");
	}
	return await response.json();
}

export async function getDesks() {
	const response = await fetch(`${API_BASE_URL}/desks`, {
		credentials: "include",
	});
	if (!response.ok) {
		throw new Error("Failed to fetch desks");
	}
	return response.json();
}

export async function getBookingsFiltered({ from, to, userId } = {}) {
	const params = new URLSearchParams();
	if (from) params.append("from", from);
	if (to) params.append("to", to);
	if (userId) params.append("userId", userId);
	const query = params.toString() ? `?${params.toString()}` : "";
	const response = await fetch(`${API_BASE_URL}/bookings${query}`, {
		credentials: "include",
	});
	if (!response.ok) {
		throw new Error("Failed to fetch bookings");
	}
	return response.json();
}

export async function getBookings(params) {
	if (params) {
		return getBookingsFiltered(params);
	}
	const response = await fetch(`${API_BASE_URL}/bookings`, {
		credentials: "include",
	});
	if (!response.ok) {
		throw new Error("Failed to fetch bookings");
	}
	return response.json();
}

export async function createBooking(bookingData) {
	const response = await fetch(`${API_BASE_URL}/bookings`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(bookingData),
		credentials: "include",
	});
	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.error || "Failed to create booking");
	}
	return response.json();
}

export async function deleteBooking(bookingId) {
	const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
		method: "DELETE",
		credentials: "include",
	});
	if (!response.ok) {
		throw new Error("Failed to delete booking");
	}
	// If backend returns 204 No Content, just return a success message
	if (response.status === 204) {
		return { success: true, message: "Booking deleted successfully." };
	}
	const text = await response.text();
	return text
		? JSON.parse(text)
		: { success: true, message: "Booking deleted successfully." };
}

export async function logoutUser() {
	const response = await fetch(`${API_BASE_URL}/auth/logout`, {
		method: "POST",
		credentials: "include",
	});
	if (!response.ok) {
		throw new Error("Logout failed");
	}
	return response.json();
}

export async function getMyBookings() {
	const response = await fetch(`${API_BASE_URL}/bookings/my`, {
		credentials: "include",
	});
	if (!response.ok) {
		throw new Error("Failed to fetch your bookings");
	}
	return response.json();
}

