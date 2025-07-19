import db from "../../db.js";
import { sql } from "../../utils/database.js";

export async function getAll() {
	const { rows } = await db.query(sql`SELECT * FROM desk;`);
	return rows;
}
