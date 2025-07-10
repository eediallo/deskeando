import db from "../../db.js";

export async function getAll() {
	const { rows } = await db.query("SELECT * FROM bookings;");
	return rows;
}

export async function getBookingsForDate(date) {
	const { rows } = await db.query(
		"SELECT * FROM bookings WHERE from_date = $1;",
		[date],
	);
	return rows;
}

export async function isDeskBookedOnDate(desk_id, date) {
	const { rows } = await db.query(
		"SELECT 1 FROM bookings WHERE desk_id = $1 AND from_date = $2 LIMIT 1;",
		[desk_id, date],
	);
	return rows.length > 0;
}

export async function isUserBookedOnDate(user_id, date) {
	const { rows } = await db.query(
		"SELECT 1 FROM bookings WHERE user_id = $1 AND from_date = $2 LIMIT 1;",
		[user_id, date],
	);
	return rows.length > 0;
}

export async function getOneBookingById(id) {
	const { rows } = await db.query(
		"SELECT * FROM bookings WHERE book_id = $1;",
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

export async function createBooking({ user_id, desk_id, date }) {
	const from_date = date;
	const to_date = date;

	const query = `
       INSERT INTO bookings (user_id, desk_id, from_date, to_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *;
   `;

	const values = [user_id, desk_id, from_date, to_date];
	const { rows } = await db.query(query, values);

	return rows[0];
}
