import { PostgreSqlContainer } from "@testcontainers/postgresql";
import dotenv from "dotenv";
dotenv.config();
import { runner } from "node-pg-migrate";
import { vi } from "vitest";

import { connectDb, disconnectDb } from "./db.js";
import config from "./utils/config.js";

// Initialize config first - this will use JWT_SECRET from environment variables
// when available (in CI/CD), and we don't need to expose it here
try {
	// Initialize with default test values that will be overridden by
	// actual environment variables if they exist
	config.init({});
} catch {
	// In CI environments, we'll need to provide the JWT_SECRET
	// We can't log here since logger depends on config
	process.exitCode = 1;
}

// Then import logger
const logger = await import("./utils/logger.js").then((m) => m.default);

/** @type {import("@testcontainers/postgresql").StartedPostgreSqlContainer} */
let dbContainer;

beforeAll(async () => {
	// Skip container setup if Docker isn't available
	if (!(await isDockerAvailable())) {
		// Mock the database connection for tests
		vi.mock("./db.js", () => ({
			connectDb: vi.fn().mockResolvedValue(undefined),
			disconnectDb: vi.fn().mockResolvedValue(undefined),
			testConnection: vi.fn().mockResolvedValue(undefined),
			query: vi.fn().mockResolvedValue({ rows: [] }),
		}));
		return;
	}

	try {
		dbContainer = await new PostgreSqlContainer("postgres:17-alpine").start();
		const url = new URL(dbContainer.getConnectionUri());
		url.searchParams.set(
			"sslmode",
			url.searchParams.get("sslmode") ?? "disable",
		);
		// Pass DATABASE_URL from container but keep using existing JWT_SECRET from environment
		config.init({
			DATABASE_URL: url.toString(),
			PORT: "0",
		});
		await applyMigrations();
		await connectDb();
	} catch (error) {
		logger.error("Failed to start database container:", error.message);
		// Mock the database connection for tests
		vi.mock("./db.js", () => ({
			connectDb: vi.fn().mockResolvedValue(undefined),
			disconnectDb: vi.fn().mockResolvedValue(undefined),
			testConnection: vi.fn().mockResolvedValue(undefined),
			query: vi.fn().mockResolvedValue({ rows: [] }),
		}));
	}
}, 60_000);

afterAll(async () => {
	await disconnectDb();
	if (dbContainer) {
		await dbContainer.stop();
	}
});

async function applyMigrations() {
	await runner({ ...config.migrationConfig, direction: "up" });
}

/**
 * Simple check if Docker is available
 */
async function isDockerAvailable() {
	try {
		// Try to execute a simple Docker command
		const { execSync } = await import("child_process");
		execSync("docker info", { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
}
