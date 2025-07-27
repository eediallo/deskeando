import { test, expect } from "./fixtures.js";

test("has title", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveTitle(/Have A Look - Book Your Desk/);
});

test("meets a11y requirements", async ({ axe, page }) => {
	await page.goto("/");

	const { violations } = await axe.analyze();
	expect(violations).toHaveLength(0);
});
