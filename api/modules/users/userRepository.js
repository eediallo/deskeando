import bcryptjs from "bcryptjs";

import db from "../../db.js";

export async function getAll() {
	const { rows } = await db.query('SELECT * FROM "user";');
	return rows;
}

export async function registerUser({ firstName, lastName, email, password }) {
	const checkQuery = `SELECT id FROM "user" WHERE email = $1`;
	const checkResult = await db.query(checkQuery, [email]);
	if (checkResult.rows.length > 0) {
		throw new Error("Email already in use.");
	}

	const hashedPassword = await bcryptjs.hash(password, 10);

	const query = `
	   INSERT INTO "user" (first_name, last_name, email, password)
	   VALUES ($1, $2, $3, $4)
	   RETURNING *;
   `;

	const values = [firstName, lastName, email, hashedPassword];
	const { rows } = await db.query(query, values);
	return rows[0];
}

export async function findUserByEmail(email) {
	const query = 'SELECT * FROM "user" WHERE email = $1';
	const { rows } = await db.query(query, [email]);
	return rows[0];
}
