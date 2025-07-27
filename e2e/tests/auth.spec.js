import { test, expect } from "./fixtures.js";

// Test suite for authentication features
test.describe("Authentication", () => {
	test.beforeEach(async ({ page }) => {
		// Start each test at the login page
		await page.goto("/login");
	});

	test("login page has correct elements", async ({ page }) => {
		// Check for login form elements
		await expect(
			page.getByRole("heading", { level: 2, name: "Login" }),
		).toBeVisible();
		await expect(page.getByPlaceholder("Email")).toBeVisible();
		await expect(page.getByPlaceholder("Password")).toBeVisible();
		await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
	});

	test("can login with valid credentials", async ({ page }) => {
		// Fill in login form
		await page.getByPlaceholder("Email").fill("alice@gmail.com");
		await page.getByPlaceholder("Password").fill("sosecret");

		// Submit the form
		await page.getByRole("button", { name: "Login" }).click();

		// Verify successful login (redirected to dashboard)
		await page.waitForURL("**/dashboard");

		// Check for content that confirms we're on the dashboard
		await expect(
			page.getByRole("heading", { name: "Office Available Desks" }),
		).toBeVisible();
	});

	test("shows error with invalid credentials", async ({ page }) => {
		// Fill in login form with invalid credentials
		await page.getByPlaceholder("Email").fill("wrong@example.com");
		await page.getByPlaceholder("Password").fill("wrongpassword");

		// Submit the form
		await page.getByRole("button", { name: "Login" }).click();

		// Check for error message - looking at the Login.jsx code, errors are displayed in a paragraph
		await expect(
			page.locator("p").filter({ hasText: /Login failed|Invalid/i }),
		).toBeVisible();
		// We should still be on the login page
		expect(page.url()).toContain("/login");
	});

	test("can logout successfully", async ({ page }) => {
		// First login
		await page.getByPlaceholder("Email").fill("alice@gmail.com");
		await page.getByPlaceholder("Password").fill("sosecret");
		await page.getByRole("button", { name: "Login" }).click();

		// Wait for dashboard to load
		await page.waitForURL("**/dashboard");

		// Find and click user menu
		await page.locator(".sidebar-bottom details").click();

		// Click logout button
		await page.locator("button").filter({ hasText: "Logout" }).click();

		// Verify redirect to login page
		await page.waitForURL("**/login");

		// Verify login elements are visible again
		await expect(
			page.getByRole("heading", { level: 2, name: "Login" }),
		).toBeVisible();
	});

	test("meets a11y requirements", async ({ axe, page }) => {
		// Make sure we're on the login page
		await page.goto("/login");

		// Wait for essential elements to be visible
		await expect(
			page.getByRole("heading", { level: 2, name: "Login" }),
		).toBeVisible();
		await expect(page.getByPlaceholder("Email")).toBeVisible();

		// Test login page for accessibility
		const { violations } = await axe.analyze();

		// Only check for critical violations
		const criticalViolations = violations.filter(
			(v) => v.impact === "critical",
		);
		expect(criticalViolations).toHaveLength(0);
	});
});
