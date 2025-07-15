/**
 * Template for
 * {@link https://salsita.github.io/node-pg-migrate/migrations/ defining migrations}.
 */

/**
 * Create the main database schema for the deskeando application.
 *
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 * @returns {void | Promise<void>}
 */
export async function up(pgm) {
	// Enable UUID extension
	pgm.createExtension("uuid-ossp", { ifNotExists: true });

	// Create desk table
	pgm.createTable("desk", {
		id: {
			type: "uuid",
			primaryKey: true,
			default: pgm.func("uuid_generate_v4()"),
		},
		name: {
			type: "text",
			notNull: true,
		},
	});

	// Create user table
	pgm.createTable("user", {
		id: {
			type: "uuid",
			primaryKey: true,
			default: pgm.func("uuid_generate_v4()"),
		},
		first_name: {
			type: "text",
		},
		last_name: {
			type: "text",
		},
		email: {
			type: "text",
			notNull: true,
			unique: true,
		},
		password: {
			type: "varchar(255)",
			notNull: true,
		},
	});

	// Create booking table
	pgm.createTable("booking", {
		id: {
			type: "uuid",
			primaryKey: true,
			default: pgm.func("uuid_generate_v4()"),
		},
		desk_id: {
			type: "uuid",
			notNull: true,
			references: '"desk"(id)',
			onDelete: "cascade",
		},
		user_id: {
			type: "uuid",
			notNull: true,
			references: '"user"(id)',
			onDelete: "cascade",
		},
		from_date: {
			type: "timestamp with time zone",
			notNull: true,
		},
		to_date: {
			type: "timestamp with time zone",
			notNull: true,
		},
	});

	// Add unique constraint: only one booking per desk per date
	pgm.addConstraint("booking", "unique_desk_date", {
		unique: ["desk_id", "from_date"],
	});

	// Insert initial data for desks
	pgm.sql(`
		INSERT INTO "desk" (id, name) VALUES
		('b142a09d-76f7-4140-a401-52a7bc5f22c5','Desk 1'),
		('5edac634-6a5b-4f38-89d0-b10161e66186', 'Desk 2'),
		('7c5fa573-16bf-4b91-b90a-3c8303a6e14f', 'Desk 3'),
		('db4f01e4-9d64-4732-a099-9664db206f08','Desk 4'),
		('5b3d6606-4dd1-4e01-92fb-889303c5939a','Desk 5');
	`);

	// insert rest of initial data for desks
	pgm.sql(`
		INSERT INTO "desk" (name)
		VALUES
		${Array.from({ length: 45 }, (_, i) => `('Desk ${i + 6}')`).join(",\n")}
	;
	`);

	// Insert initial data for users with bcrypt-hashed passwords (ESM compatible)
	const bcrypt = await import("bcryptjs");
	const hash = (pw) => bcrypt.default.hashSync(pw, 10);
	const aliceHash = hash("sosecret");
	const bobHash = hash("sosecret");
	const charlieHash = hash("sosecret");
	const dianaHash = hash("sosecret");
	const ethanHash = hash("sosecret");
	pgm.sql(`INSERT INTO "user" (id, first_name, last_name, email, password) VALUES
		('26136694-7c90-41c3-9787-b7f0bd776a23', 'Alice', 'Smith', 'alice@gmail.com', '${aliceHash}'),
		('c6dbfcba-a714-4f26-a658-f6292ca7586e','Bob', 'Johnson', 'bob@gmail.cl', '${bobHash}'),
		('fbd8d766-73b9-4cd0-b11e-8fb507ca0d53','Charlie', 'Lee', 'charlie@gmail.com', '${charlieHash}'),
		('82f7e975-c803-4fb8-be96-4f7c9bfa6a0c','Diana', 'Brown', 'diana@gmail.com', '${dianaHash}'),
		('35abf422-88d4-4de4-aa02-7294e8ac796e','Ethan', 'Wilson', 'ethan@gmail.com', '${ethanHash}');
	`);

	// Insert initial data for bookings
	pgm.sql(`
		INSERT INTO "booking" (desk_id, user_id, from_date, to_date) VALUES
		('b142a09d-76f7-4140-a401-52a7bc5f22c5', '26136694-7c90-41c3-9787-b7f0bd776a23', '2025-07-01', '2025-07-01'),
		('5edac634-6a5b-4f38-89d0-b10161e66186', 'c6dbfcba-a714-4f26-a658-f6292ca7586e', '2025-07-02', '2025-07-02'),
		('7c5fa573-16bf-4b91-b90a-3c8303a6e14f', 'fbd8d766-73b9-4cd0-b11e-8fb507ca0d53', '2025-07-03', '2025-07-03'),
		('db4f01e4-9d64-4732-a099-9664db206f08', '82f7e975-c803-4fb8-be96-4f7c9bfa6a0c', '2025-07-04', '2025-07-04'),
		('5b3d6606-4dd1-4e01-92fb-889303c5939a', '35abf422-88d4-4de4-aa02-7294e8ac796e', '2025-07-05', '2025-07-05');
	`);
}

/**
 * Undo the changes introduced by the `up` function.
 *
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 * @returns {void | Promise<void>}
 */
export async function down(pgm) {
	pgm.dropTable("booking");
	pgm.dropTable("user");
	pgm.dropTable("desk");
	pgm.dropExtension("uuid-ossp");
}

/** @type {Record<string, import("node-pg-migrate").ColumnDefinition>} */
export const shorthands = {};
