import bcrypt from "bcryptjs";
import { describe, it, expect, beforeEach, vi } from "vitest";

import db from "../db.js";
import config from "../utils/config.js";
config.init();

import { createRequest } from "./testUtils.js";

// Mock bcrypt functions
vi.mock("bcryptjs", () => ({
	default: {
		hash: vi.fn().mockResolvedValue("$2a$10$validbcrypthashplaceholder"),
		compare: vi.fn(),
	},
}));

// Mock database module
vi.mock("../db.js", () => ({
	default: {
		query: vi.fn(),
	},
}));

describe("authRouter", () => {
	const testUser = {
		firstName: "Test",
		lastName: "User",
		email: `testuser_${Date.now()}@example.com`,
		password: "password123",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should register a new user and then login (happy path)", async () => {
		// 1st call: check for existing user -> none
		db.query.mockResolvedValueOnce({ rows: [] });
		// 2nd call: insert new user
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 1,
					first_name: testUser.firstName,
					last_name: testUser.lastName,
					email: testUser.email,
					password: "$2a$10$validbcrypthashplaceholder",
				},
			],
		});
		// 3rd call: lookup for login
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 1,
					first_name: testUser.firstName,
					last_name: testUser.lastName,
					email: testUser.email,
					password: "$2a$10$validbcrypthashplaceholder",
				},
			],
		});
		bcrypt.compare.mockResolvedValue(true);

		const request = await createRequest();

		// Register
		const registerRes = await request
			.post("/api/v1/auth/register")
			.send(testUser);
		expect(registerRes.status).toBe(201);
		expect(registerRes.body).toHaveProperty("id");
		expect(registerRes.body.email).toBe(testUser.email);

		// Login
		const loginRes = await request.post("/api/v1/auth/login").send({
			email: testUser.email,
			password: testUser.password,
		});
		expect(loginRes.status).toBe(200);
		expect(loginRes.body).toHaveProperty("token");

		// Ensure DB calls happened as expected
		expect(db.query).toHaveBeenCalledTimes(3);
	});

	it("should return 409 when registering an already existing email", async () => {
		// 1st call: check for existing user -> found one
		db.query.mockResolvedValueOnce({ rows: [{ id: 2 }] });

		const request = await createRequest();
		const res = await request.post("/api/v1/auth/register").send(testUser);

		expect(res.status).toBe(409);
		// Error message is returned in 'error' field
		expect(res.body).toHaveProperty("error");
		expect(res.body.error).toMatch(/already in use/i);
		expect(db.query).toHaveBeenCalledTimes(1);
	});

	it("should return 401 when logging in with wrong password", async () => {
		// 1st call: lookup for login
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 3,
					first_name: "Foo",
					last_name: "Bar",
					email: testUser.email,
					password: "$2a$10$validbcrypthashplaceholder",
				},
			],
		});
		// bcrypt.compare returns false
		bcrypt.compare.mockResolvedValue(false);

		const request = await createRequest();
		const res = await request.post("/api/v1/auth/login").send({
			email: testUser.email,
			password: "wrongpassword",
		});

		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty("error");
		expect(res.body.error).toMatch(/invalid credentials/i);
		expect(db.query).toHaveBeenCalledTimes(1);
	});

	it("should return 401 when logging in with unregistered email", async () => {
		// 1st call: lookup for login -> no user
		db.query.mockResolvedValueOnce({ rows: [] });

		const request = await createRequest();
		const res = await request.post("/api/v1/auth/login").send({
			email: "nonexistent@example.com",
			password: "password123",
		});

		// Unregistered emails also return 401
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty("error");
		expect(res.body.error).toMatch(/invalid credentials/i);
		expect(db.query).toHaveBeenCalledTimes(1);
	});
});
