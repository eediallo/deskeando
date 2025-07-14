import db from "../../db.js";

export async function getAll() {
	const { rows } = await db.query('SELECT * FROM "user";');
	return rows;
}

export async function registerUser({ firstName, lastName, email, password }) {
	if (!email || typeof email !== "string" || !email.trim()) {
		throw new Error("Email is required");
	}
	const query = `
	   INSERT INTO "user" (first_name, last_name, email, password)
	   VALUES ($1, $2, $3, $4)
	   RETURNING *;
   `;

	const values = [firstName, lastName, email, password];
	const { rows } = await db.query(query, values);
	return rows[0];
}
