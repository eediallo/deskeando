import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";

describe("Simultaneous Load Test - 500 Users with Desk Polling and Timing Summary", () => {
	const baseUrl = process.env.API_URL || "http://localhost:3000";
	const TEST_USER_COUNT = 500;
	const POLL_INTERVAL = 5000; // 5 seconds
	const POLL_COUNT = 6; // number of polls per login session

	beforeAll(async () => {
		const health = await request(baseUrl).get("/healthz").timeout(10000);
		if (health.status !== 200) {
			throw new Error(`API not healthy (status ${health.status})`);
		}
	});

	it("registers 500 users simultaneously with polling desks every 5s and outputs timing summary", async () => {
		const timestamp = Date.now();
		console.log(
			`\n=== STARTING SIMULTANEOUS LOAD TEST WITH POLLING & TIMING SUMMARY ===`,
		);

		// 1) Registration phase
		console.log(`Registering ${TEST_USER_COUNT} users simultaneously...`);

		const registrationPromises = Array.from(
			{ length: TEST_USER_COUNT },
			(_, idx) => {
				const email = `simultaneous_user${idx}_${timestamp}@example.com`;
				return request(baseUrl)
					.post("/api/v1/auth/register")
					.send({
						firstName: `SimultaneousUser${String.fromCharCode(65 + (idx % 26))}`,
						lastName: `Test${String.fromCharCode(65 + ((idx + 1) % 26))}`,
						email,
						password: "Password123!",
					})
					.then((res) => ({
						id: res.body.id || res.body.user?.id || idx,
						email,
						success: res.status >= 200 && res.status < 300,
						status: res.status,
					}))
					.catch((err) => ({
						id: idx,
						email,
						success: false,
						error: err.message,
					}));
			},
		);

		const registrationResults = await Promise.all(registrationPromises);
		const successfulRegistrations = registrationResults.filter(
			(r) => r.success,
		);
		console.log(`\n=== REGISTRATION RESULTS ===`);
		console.log(
			`Successful: ${successfulRegistrations.length}/${TEST_USER_COUNT}`,
		);
		expect(successfulRegistrations.length).toBeGreaterThan(0);

		// 2) Login, polling, and booking phase
		console.log(
			`\n=== STARTING SIMULTANEOUS LOGIN, POLLING, AND RACE TEST ===`,
		);

		// collect all desk-fetch latencies here:
		const allDeskTimings = [];

		const loginAndRacePromises = successfulRegistrations.map((user) => {
			return request
				.agent(baseUrl)
				.post("/api/v1/auth/login")
				.send({ email: user.email, password: "Password123!" })
				.then(async (loginRes) => {
					if (loginRes.status !== 200) {
						return { user, success: false };
					}

					const agent = request.agent(baseUrl);
					(loginRes.headers["set-cookie"] || []).forEach((cookie) =>
						agent.set("Cookie", cookie),
					);

					let desks;
					for (let i = 1; i <= POLL_COUNT; i++) {
						const t0 = Date.now();
						const res = await agent.get("/api/v1/desks");
						const dt = Date.now() - t0;

						if (res.status !== 200) {
							throw new Error(`Desks fetch #${i} failed: ${res.status}`);
						}
						desks = res.body;
						allDeskTimings.push(dt);

						if (i < POLL_COUNT) {
							await new Promise((r) => setTimeout(r, POLL_INTERVAL));
						}
					}

					// booking attempt
					if (desks && desks.length > 0) {
						const deskId = desks[0].id;
						const tomorrow = new Date();
						tomorrow.setDate(tomorrow.getDate() + 1);
						tomorrow.setUTCHours(13, 0, 0, 0);
						const bookingDate = tomorrow.toISOString().split("T")[0];

						const bookingRes = await agent
							.post("/api/v1/bookings")
							.send({ userId: user.id, deskId, bookingDate });

						return { user, success: true, wonRace: bookingRes.status === 201 };
					}
					return { user, success: true, wonRace: false };
				})
				.catch(() => ({ user, success: false }));
		});

		const raceResults = await Promise.all(loginAndRacePromises);
		const successfulLogins = raceResults.filter((r) => r.success);
		const raceWinners = raceResults.filter((r) => r.wonRace);

		console.log(`\n=== SIMULTANEOUS RACE CONDITION RESULTS ===`);
		console.log(
			`Logins: ${successfulLogins.length}/${successfulRegistrations.length}`,
		);
		console.log(`Winners: ${raceWinners.length}`);

		// 3) Output timing summary
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

		// Final assertions
		expect(successfulLogins.length).toBeGreaterThan(0);
		expect(raceWinners.length).toBeLessThanOrEqual(1);
	}, 300000);
});
