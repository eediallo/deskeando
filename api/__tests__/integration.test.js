import { describe, it, expect, beforeEach, vi, beforeAll } from "vitest";

import db from "../db.js";
import config from "../utils/config.js";

import { createRequest } from "./testUtils.js";

config.init();

// Mock bcrypt functions for testing
vi.mock("bcryptjs", () => ({
	default: {
		hash: vi.fn().mockResolvedValue("$2a$10$validbcrypthashplaceholder"),
		compare: vi.fn().mockResolvedValue(true),
	},
}));

// Mock database module
vi.mock("../db.js", () => ({
	default: {
		query: vi.fn(),
	},
}));

// Integration test for complete user journey
// Tests registration, login, desk viewing, booking, and logout
describe("Complete User Journey Integration Test", () => {
	// Test data that we'll use throughout the test
	const testUser = {
		firstName: "John",
		lastName: "Doe",
		email: `john.doe.${Date.now()}.${Math.random().toString(36).substr(2, 9)}@example.com`,
		password: "securepassword123",
	};

	const testDesk = {
		id: 1,
		name: "Desk A1",
		location: "Floor 1",
		status: "available",
	};

	const testBooking = {
		deskId: 1,
		date: new Date(Date.now() + 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0], // Tomorrow's date
		startTime: "09:00",
		endTime: "17:00",
	};

	let request;
	let authToken;
	let userId;

	// Setup before all tests in this describe block
	beforeAll(async () => {
		// Create a test request agent
		request = await createRequest();
	});

	// Reset mocks before each test
	beforeEach(() => {
		vi.clearAllMocks();
	});

	// Main test - complete user journey from registration to logout
	it("should complete the full user journey: register → login → view desks → book desk → view bookings → logout", async () => {
		// Step 1: User Registration

		// Mock database responses for registration
		// First call: check if user exists (should return empty)
		db.query.mockResolvedValueOnce({ rows: [] });
		// Second call: insert new user
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

		// Make the registration request
		const registerResponse = await request
			.post("/api/v1/auth/register")
			.send(testUser);

		// Verify registration was successful
		expect(registerResponse.status).toBe(
			201,
			"Registration should return 201 Created",
		);
		expect(registerResponse.body).toHaveProperty("id");
		expect(registerResponse.body.email).toBe(
			testUser.email,
			"Email should match",
		);
		expect(registerResponse.body.first_name).toBe(
			testUser.firstName,
			"First name should match",
		);
		expect(registerResponse.body.last_name).toBe(
			testUser.lastName,
			"Last name should match",
		);

		userId = registerResponse.body.id;

		// Step 2: User Login

		// Mock database response for login (user lookup)
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: userId,
					first_name: testUser.firstName,
					last_name: testUser.lastName,
					email: testUser.email,
					password: "$2a$10$validbcrypthashplaceholder",
				},
			],
		});

		// Make the login request
		const loginResponse = await request.post("/api/v1/auth/login").send({
			email: testUser.email,
			password: testUser.password,
		});

		// Verify login was successful
		expect(loginResponse.status).toBe(200, "Login should return 200 OK");
		expect(loginResponse.body).toHaveProperty("token");
		expect(loginResponse.headers["set-cookie"]).toBeDefined(
			"Should set authentication cookie",
		);

		authToken = loginResponse.body.token;

		// Step 3: View Available Desks

		// Mock database response for getting desks
		db.query.mockResolvedValueOnce({
			rows: [
				{ ...testDesk, status: "available" },
				{ id: 2, name: "Desk A2", location: "Floor 1", status: "occupied" },
				{ id: 3, name: "Desk B1", location: "Floor 2", status: "available" },
			],
		});

		// Make the request to get desks
		const desksResponse = await request
			.get("/api/v1/desks")
			.set("Cookie", `token=${authToken}`);

		// Verify desks were retrieved successfully
		expect(desksResponse.status).toBe(
			200,
			"Desks request should return 200 OK",
		);
		expect(Array.isArray(desksResponse.body)).toBe(
			true,
			"Response should be an array",
		);
		expect(desksResponse.body.length).toBeGreaterThan(
			0,
			"Should return at least one desk",
		);

		// Check that we have available desks
		const availableDesks = desksResponse.body.filter(
			(desk) => desk.status === "available",
		);
		expect(availableDesks.length).toBeGreaterThan(
			0,
			"Should have at least one available desk",
		);

		// Step 4: Book a Desk

		// Mock database responses for booking
		// First call: check if user is already booked on this date (should return empty)
		db.query.mockResolvedValueOnce({ rows: [] });
		// Second call: check if desk is already booked on this date (should return empty)
		db.query.mockResolvedValueOnce({ rows: [] });
		// Third call: create the booking
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 1,
					desk_id: testBooking.deskId,
					user_id: userId,
					date: new Date(testBooking.date).toISOString(),
					created_at: new Date().toISOString(),
				},
			],
		});

		// Make the booking request
		const bookingResponse = await request
			.post("/api/v1/bookings")
			.set("Cookie", `token=${authToken}`)
			.send({
				userId: userId,
				deskId: testBooking.deskId,
				bookingDate: testBooking.date,
			});

		// Verify booking was successful
		expect(bookingResponse.status).toBe(
			201,
			"Booking should return 201 Created",
		);
		expect(bookingResponse.body).toHaveProperty("id");
		expect(bookingResponse.body.desk_id).toBe(
			testBooking.deskId,
			"Desk ID should match",
		);

		// Step 5: View User's Bookings

		// Mock database response for getting user's bookings
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 1,
					desk_id: testBooking.deskId,
					desk_name: testDesk.name,
					desk_location: testDesk.location,
					date: testBooking.date,
					start_time: testBooking.startTime,
					end_time: testBooking.endTime,
					created_at: new Date().toISOString(),
				},
			],
		});

		// Make the request to get user's bookings
		const myBookingsResponse = await request
			.get("/api/v1/bookings/my")
			.set("Cookie", `token=${authToken}`);

		// Verify bookings were retrieved successfully
		expect(myBookingsResponse.status).toBe(
			200,
			"My bookings request should return 200 OK",
		);
		expect(myBookingsResponse.body).toHaveProperty("upcoming");
		expect(myBookingsResponse.body).toHaveProperty("past");

		// Step 6: User Logout

		// Make the logout request
		const logoutResponse = await request
			.post("/api/v1/auth/logout")
			.set("Cookie", `token=${authToken}`);

		// Verify logout was successful
		expect(logoutResponse.status).toBe(200, "Logout should return 200 OK");
		expect(logoutResponse.body).toHaveProperty("message");
		expect(logoutResponse.headers["set-cookie"]).toBeDefined(
			"Should clear authentication cookie",
		);

		// Step 7: Verify Authentication is Required After Logout

		// Try to access protected resource without authentication
		const unauthorizedResponse = await request.get("/api/v1/desks");

		// Verify that authentication is required
		expect(unauthorizedResponse.status).toBe(
			401,
			"Should require authentication",
		);

		// Final verification: Database Calls

		// Verify that all expected database calls were made
		expect(db.query).toHaveBeenCalledTimes(
			8,
			"Should have made 8 database calls total",
		);
	});

	// Test error handling for invalid registration data
	it("should handle invalid registration data gracefully", async () => {
		const invalidUser = {
			firstName: "", // Empty first name
			lastName: "Doe",
			email: "invalid-email", // Invalid email format
			password: "123", // Too short password
		};

		const request = await createRequest();
		const response = await request
			.post("/api/v1/auth/register")
			.send(invalidUser);

		// Verify that validation errors are returned
		expect(response.status).toBe(
			400,
			"Should return 400 Bad Request for invalid data",
		);
		expect(response.body).toHaveProperty("error");
		expect(response.body.error).toContain(
			"Missing firstName",
			"Should mention missing firstName",
		);
	});

	// Test that protected routes require authentication
	it("should require authentication for protected routes", async () => {
		const request = await createRequest();

		// Test accessing desks without authentication
		const desksResponse = await request.get("/api/v1/desks");
		expect(desksResponse.status).toBe(
			401,
			"Should require authentication for desks",
		);

		// Test accessing bookings without authentication
		const bookingsResponse = await request.get("/api/v1/bookings/my");
		expect(bookingsResponse.status).toBe(
			401,
			"Should require authentication for bookings",
		);

		// Test creating booking without authentication
		const createBookingResponse = await request
			.post("/api/v1/bookings")
			.send(testBooking);
		expect(createBookingResponse.status).toBe(
			401,
			"Should require authentication for creating bookings",
		);
	});
});
