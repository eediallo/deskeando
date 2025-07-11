import db from "../../db.js";

export async function getAll() {
	const { rows } = await db.query(
		"SELECT * FROM bookings b JOIN users u ON b.user_id = u.user_id JOIN desks d ON b.desk_id = d.desk_id;",
	);
	return rows;
}

export async function getBookingsForDate(date) {
	const { rows } = await db.query(
		"SELECT * FROM bookings b JOIN users u ON b.user_id = u.user_id JOIN desks d ON b.desk_id = d.desk_id WHERE from_date = $1;",
		[date],
	);
	return rows;
}

export async function isDeskBookedOnDate(deskId, date) {
	const { rows } = await db.query(
		"SELECT 1 FROM bookings WHERE desk_id = $1 AND from_date = $2 LIMIT 1;",
		[deskId, date],
	);
	return rows.length > 0;
}

export async function isUserBookedOnDate(userId, date) {
	const { rows } = await db.query(
		"SELECT 1 FROM bookings WHERE user_id = $1 AND from_date = $2 LIMIT 1;",
		[userId, date],
	);
	return rows.length > 0;
}

export async function getOneBookingById(id) {
	const { rows } = await db.query(
		"SELECT * FROM bookings b JOIN users u ON b.user_id = u.user_id JOIN desks d ON b.desk_id = d.desk_id WHERE book_id = $1;",
		[id],
	);
	return rows;
}

export async function deleteOneBookingById(id) {
	const { rows } = await db.query(
		"DELETE FROM bookings WHERE book_id = $1 RETURNING *;",
		[id],
	);
	return rows;
}

export async function createBooking({ userId, deskId, date }) {
	const fromDate = new Date(`${date}T13:00:00Z`).toISOString();
	const toDate = new Date(`${date}T19:00:00Z`).toISOString();

	const query = `
       INSERT INTO bookings (user_id, desk_id, from_date, to_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *;
   `;
	const values = [userId, deskId, fromDate, toDate];
	const { rows } = await db.query(query, values);
	return rows[0];
}
