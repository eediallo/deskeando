import bcryptjs from "bcryptjs";

import db from "../../db.js";
import { sql } from "../../utils/database.js";

export async function getAll() {
	const { rows } = await db.query(
		sql`
		SELECT 
			id, 
			first_name, 
			last_name, 
			email 
		FROM "user";`,
	);
	return rows;
}

export async function registerUser({ firstName, lastName, email, password }) {
	const checkResult = await db.query(
		sql`
		SELECT 
			id
		FROM "user" 
		WHERE email = $1
	`,
		[email],
	);
	if (checkResult.rows.length > 0) {
		throw new Error("Email already in use.");
	}

	const hashedPassword = await bcryptjs.hash(password, 10);

	const values = [firstName, lastName, email, hashedPassword];
	const { rows } = await db.query(
		sql`
	   INSERT 
	   	INTO "user" (first_name, last_name, email, password)
	   VALUES ($1, $2, $3, $4)
	   RETURNING *;
   `,
		values,
	);
	return rows[0];
}

export async function findUserByEmail(email) {
	const { rows } = await db.query(
		sql`
		SELECT * FROM "user"
			WHERE email = $1
	`,
		[email],
	);
	return rows[0];
}
