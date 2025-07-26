import db from "../../db.js";
import { sql } from "../../utils/database.js";

export async function getAll() {
	const { rows } = await db.query(
		sql`
			SELECT 
				b.id AS booking_id, 
				b.desk_id, b.user_id, 
				b.from_date, b.to_date, 
				u.first_name, u.last_name, 
				d.name AS desk_name 
			FROM 
				booking b 
			JOIN "user" u ON b.user_id = u.id 
			JOIN desk d ON b.desk_id = d.id;
		`,
	);
	return rows;
}

export async function getBookingsForDate(date) {
	const { rows } = await db.query(
		sql`
			SELECT
				b.id AS booking_id,
				b.desk_id,
				b.user_id,
				b.from_date,
				b.to_date,
				u.first_name,
				u.last_name,
				d.name AS desk_name
			FROM booking b
				JOIN "user" u ON b.user_id = u.id
				JOIN desk d ON b.desk_id = d.id
				WHERE b.from_date = $1;
		`,
		[date],
	);
	return rows;
}

export async function isDeskBookedOnDate(deskId, date) {
	const { rows } = await db.query(
		sql`
			SELECT *
				FROM booking
			WHERE desk_id = $1
				AND from_date = $2
			LIMIT 1;
		`,
		[deskId, date],
	);
	return rows.length > 0;
}

export async function isUserBookedOnDate(userId, date) {
	const { rows } = await db.query(
		sql`
	  SELECT 1
		FROM booking
	  WHERE user_id = $1
		AND from_date = $2 LIMIT 1;
	`,
		[userId, date],
	);
	return rows.length > 0;
}

export async function getOneBookingById(id) {
	const { rows } = await db.query(
		sql`
			SELECT
				b.id AS booking_id,
				b.desk_id,
				b.user_id,
				b.from_date,
				b.to_date,
				u.first_name,
				u.last_name,
				d.name AS desk_name
			FROM booking b
			JOIN "user" u ON b.user_id = u.id
			JOIN desk d ON b.desk_id = d.id
				WHERE b.id = $1;
		`,
		[id],
	);
	return rows[0] || null;
}

export async function deleteOneBookingById(id) {
	const { rows } = await db.query(
		sql`
			DELETE FROM booking
				WHERE id = $1
			RETURNING *;
		`,
		[id],
	);
	return rows[0] || null;
}

export async function createBooking({ userId, deskId, date }) {
	const till = new Date(date);
	till.setUTCHours(19, 0, 0, 0);
	const toDate = till.toISOString();

	const { rows } = await db.query(
		sql`
		WITH new_booking AS (
		INSERT INTO booking (user_id, desk_id, from_date, to_date)
			VALUES ($1, $2, $3, $4)
		RETURNING *)
		SELECT 
			b.id AS booking_id, 
			b.desk_id, b.user_id, 
			b.from_date, b.to_date, 
			u.first_name, u.last_name, 
			d.name AS desk_name 
		FROM 
			new_booking b 
		JOIN "user" u ON b.user_id = u.id 
		JOIN desk d ON b.desk_id = d.id
  		`,
		[userId, deskId, date, toDate],
	);
	return rows[0];
}

export async function getFilteredBookings({ from, to, userId }) {
	let query = sql`
		SELECT 
			b.id AS booking_id, 
			b.desk_id, b.user_id, 
			b.from_date, b.to_date, 
			u.first_name, u.last_name, 
			d.name AS desk_name 
		FROM 
			booking b 
		JOIN "user" u ON b.user_id = u.id 
		JOIN desk d ON b.desk_id = d.id
		WHERE 1=1`;
	const params = [];
	let paramIndex = 1;

	if (from) {
		query += ` AND DATE(b.from_date) >= $${paramIndex++}`;
		params.push(from);
	}
	if (to) {
		query += ` AND DATE(b.from_date) <= $${paramIndex++}`;
		params.push(to);
	}
	if (userId) {
		query += ` AND b.user_id = $${paramIndex++}`;
		params.push(userId);
	}

	query += ";";
	const { rows } = await db.query(query, params);
	return rows;
}

export async function getBookingsForUser(userId) {
	const { rows } = await db.query(
		sql`
			SELECT 
				b.id AS booking_id, 
				b.desk_id, b.user_id, 
				b.from_date, b.to_date, 
				u.first_name, u.last_name, 
				d.name AS desk_name 
			FROM 
				booking b
				JOIN "user" u ON b.user_id = u.id 
				JOIN desk d ON b.desk_id = d.id
			WHERE b.user_id = $1
			ORDER BY b.from_date DESC;
		`,
		[userId],
	);
	return rows;
}
