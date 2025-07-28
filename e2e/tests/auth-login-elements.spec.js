import { test, expect } from "./fixtures.js";

// Test for login page elements
test("login page has correct elements", async ({ page }) => {
	// Start at the login page
	await page.goto("/login");

	// Check for login form elements
	await expect(
		page.getByRole("heading", { level: 2, name: "Login" }),
	).toBeVisible();
	await expect(page.getByPlaceholder("Email")).toBeVisible();
	await expect(page.getByPlaceholder("Password")).toBeVisible();
	await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});
