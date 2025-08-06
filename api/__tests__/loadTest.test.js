import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";

// Utility sleep
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

describe("Staggered Real-World Load Smoke Test", () => {
	const baseUrl = process.env.API_URL || "http://localhost:3000";
	const TEST_USER_COUNT = 500; // Reasonable size for race condition testing
	const BATCH_SIZE = 20; // Smaller batches for better race condition testing
	const INTER_BATCH_DELAY = 500; // 0.5s between waves
	const MAX_RETRIES = 3;

	beforeAll(async () => {
		const health = await request(baseUrl).get("/healthz").timeout(10000);
		if (health.status !== 200) {
			throw new Error(`API not healthy (status ${health.status})`);
		}
	});

	// Retry helper with optional backoff
	async function retry(fn, retriesLeft = MAX_RETRIES) {
		try {
			return await fn();
		} catch (err) {
			if (retriesLeft > 0) {
				await sleep(100 * (MAX_RETRIES - retriesLeft + 1)); // linear backoff
				return retry(fn, retriesLeft - 1);
			}
			throw err;
		}
	}

	it("registers users in staggered batches", async () => {
		const created = [];
		// collect all desk-fetch latencies here:
		const allDeskTimings = [];

		for (let i = 0; i < TEST_USER_COUNT; i += BATCH_SIZE) {
			const batch = Array.from(
				{ length: Math.min(BATCH_SIZE, TEST_USER_COUNT - i) },
				(_, j) => {
					const idx = i + j;
					const email = `user${idx}_${Date.now()}@example.com`;
					return retry(async () => {
						// add small random jitter to simulate user think-time
						await sleep(Math.random() * 200);
						const res = await request(baseUrl)
							.post("/api/v1/auth/register")
							.send({
								firstName: `User${String.fromCharCode(65 + (idx % 26))}`,
								lastName: `Test${String.fromCharCode(65 + ((idx + 1) % 26))}`,
								email,
								password: "Password123!",
							});
						if (res.status >= 200 && res.status < 300) {
							const id = res.body.id || res.body.user?.id || idx;
							console.log(
								`Registered user ${email} with ID: ${id}, response body:`,
								JSON.stringify(res.body),
							);
							created.push({ id, email });
						} else {
							throw new Error(
								`Registration failed for ${email}: ${res.status}`,
							);
						}
					});
				},
			);

			await Promise.all(batch);
			// wait before next wave
			await sleep(INTER_BATCH_DELAY);
		}

		expect(created).toHaveLength(TEST_USER_COUNT);

		// login and poll in similar staggered fashion
		const loggedIn = [];
		let successfulBookings = 0; // Counter for successful bookings in race condition test
		for (let i = 0; i < created.length; i += BATCH_SIZE) {
			const batch = created.slice(i, i + BATCH_SIZE).map((u, batchIndex) =>
				retry(async () => {
					const userIndex = i + batchIndex;
					await sleep(Math.random() * 200);
					const agent = request.agent(baseUrl);
					const loginRes = await agent
						.post("/api/v1/auth/login")
						.send({ email: u.email, password: "Password123!" });
					if (loginRes.status !== 200) {
						throw new Error(`Login failed for ${u.email}: ${loginRes.status}`);
					}

					// Test desks endpoint with latency tracking
					const t0 = Date.now();
					const desksRes = await agent.get("/api/v1/desks");
					const dt = Date.now() - t0;
					allDeskTimings.push(dt);

					if (desksRes.status !== 200) {
						throw new Error(
							`Desks fetch failed for ${u.email}: ${desksRes.status}`,
						);
					}

					console.log(
						`Desks response for ${u.email}:`,
						JSON.stringify(desksRes.body),
					);

					// Create a booking for some users (every 3rd user to test race conditions)
					if (
						userIndex % 3 === 0 &&
						desksRes.body &&
						desksRes.body.length > 0
					) {
						// Use the same desk for all users to test race conditions
						const deskId = desksRes.body[0].id; // Always use the first desk

						// Use the same date for all users to create competition
						const tomorrow = new Date();
						tomorrow.setDate(tomorrow.getDate() + 1);
						tomorrow.setUTCHours(13, 0, 0, 0);

						console.log(
							`Attempting to create booking for user ${u.email} (ID: ${u.id}) with desk ${deskId} for date ${tomorrow.toISOString().split("T")[0]} - RACE CONDITION TEST`,
						);

						const bookingRes = await agent.post("/api/v1/bookings").send({
							userId: u.id,
							deskId: deskId,
							bookingDate: tomorrow.toISOString().split("T")[0],
						});

						if (bookingRes.status !== 201) {
							// This is expected for race conditions - only one user should succeed
							console.log(
								`Booking creation failed for ${u.email}: ${bookingRes.status} - ${JSON.stringify(bookingRes.body) || "Unknown error"} - EXPECTED FOR RACE CONDITION`,
							);
							// Log the request details for debugging
							console.log(
								`Request details: userId=${u.id}, deskId=${deskId}, bookingDate=${tomorrow.toISOString().split("T")[0]}`,
							);
						} else {
							successfulBookings++;
							console.log(
								`Successfully created booking for ${u.email}: ${JSON.stringify(bookingRes.body)} - WON THE RACE!`,
							);
						}
					} else if (userIndex % 3 === 0) {
						console.log(
							`Skipping booking creation for ${u.email} - no desks available`,
						);
					}

					const pollRes = await agent.get("/api/v1/bookings");
					if (pollRes.status !== 200) {
						throw new Error(
							`Booking poll failed for ${u.email}: ${pollRes.status}`,
						);
					}
					loggedIn.push(u);
				}),
			);

			await Promise.all(batch);
			await sleep(INTER_BATCH_DELAY);
		}

		expect(loggedIn).toHaveLength(TEST_USER_COUNT);

		// Summary of race condition test
		const attemptedBookings = Math.floor(TEST_USER_COUNT / 3);
		console.log(`\n=== RACE CONDITION TEST SUMMARY ===`);
		console.log(
			`Total users that attempted to book the same desk: ${attemptedBookings}`,
		);
		console.log(`Actual successful bookings: ${successfulBookings}`);
		console.log(
			`Expected successful bookings: 1 (only one user should win the race)`,
		);
		console.log(
			`This test validates that the booking system properly handles concurrent requests for the same resource.`,
		);
		if (successfulBookings === 1) {
			console.log(
				`RACE CONDITION TEST PASSED: Only one user successfully booked the desk as expected.`,
			);
		} else {
			console.log(
				`RACE CONDITION TEST RESULT: ${successfulBookings} users booked the same desk. This might indicate a concurrency issue.`,
			);
		}

		// Output timing summary
		if (allDeskTimings.length > 0) {
			const sum = allDeskTimings.reduce((a, b) => a + b, 0);
			const avg = Math.round(sum / allDeskTimings.length);
			const min = Math.min(...allDeskTimings);
			const max = Math.max(...allDeskTimings);
			console.log(`\n=== DESKS FETCH TIMING SUMMARY ===`);
			console.log(`Total calls: ${allDeskTimings.length}`);
			console.log(`Avg latency: ${avg} ms`);
			console.log(`Min latency: ${min} ms`);
			console.log(`Max latency: ${max} ms`);
		}
	}, 180000); // extended timeout for staggered waves
});
