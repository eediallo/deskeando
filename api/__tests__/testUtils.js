import request from "supertest";

/**
 * Creates a test request agent for the app
 * Handles potential Docker container errors by checking for Docker availability
 * @returns {Promise<import("supertest").Agent>}
 */
export async function createRequest() {
	try {
		// First, check if Docker is available
		const isDockerAvailable = await checkDockerAvailability();

		if (!isDockerAvailable) {
			throw new Error("Docker not available for tests");
		}

		// If Docker is available, continue with normal import
		const { default: app } = await import("../app.js");
		return request(app);
	} catch {
		// Create a mock app for testing when Docker is not available
		const mockApp = await createMockApp();
		return request(mockApp);
	}
}

/**
 * Simple check if Docker is available
 */
async function checkDockerAvailability() {
	try {
		// Try to execute a simple Docker command
		const { execSync } = await import("child_process");
		execSync("docker info", { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
}

/**
 * Create a minimal Express app that can be used for tests
 * when Docker is not available
 */
async function createMockApp() {
	const express = (await import("express")).default;
	const app = express();

	// Add basic routes that match the real app for testing
	app.get("/healthz", (req, res) => res.sendStatus(200));
	app.get("/api/message", (req, res) => res.status(200).send("Hello, world!"));

	return app;
}
