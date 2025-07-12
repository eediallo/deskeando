import db from "../../db.js";

export async function getAll() {
	const { rows } = await db.query("SELECT * FROM users;");
	return rows;
}

export async function registerUser({ firstName, lastName }) {
	const query = `
		   INSERT INTO users (first_name, last_name)
		   VALUES ($1, $2)
		   RETURNING *;
	   `;

	const values = [firstName, lastName];
	const { rows } = await db.query(query, values);
	return rows[0];
}
