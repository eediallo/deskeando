import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import UserMenu from "./UserMenu";

describe("UserMenu component", () => {
	// Mock function
	const logoutMock = vi.fn();

	// Mock user data
	const mockUser = {
		firstName: "Alice",
		lastName: "Smith",
		email: "alice@example.com",
	};

	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should display formatted username correctly", () => {
		render(<UserMenu user={mockUser} logout={logoutMock} />);

		// Check if formatted username is displayed (firstName + lastName initial)
		const usernameElement = screen.getByText("Alice S.");
		expect(usernameElement).toBeInTheDocument();
	});

	it("should call logout function when logout button is clicked", () => {
		render(<UserMenu user={mockUser} logout={logoutMock} />);

		// Open the details menu
		const summary = screen.getByText("Alice S.");
		fireEvent.click(summary);

		// Click the logout button
		const logoutButton = screen.getByText("Logout");
		fireEvent.click(logoutButton);

		// Check if logout function was called
		expect(logoutMock).toHaveBeenCalled();
	});

	it("should render no user message when user data is missing", () => {
		render(<UserMenu user={null} logout={logoutMock} />);

		// Check if no user message is displayed
		expect(screen.getByText("No user data available")).toBeInTheDocument();
	});

	it("should have summary element that can be clicked", () => {
		render(<UserMenu user={mockUser} logout={logoutMock} />);

		// Find the summary element
		const summary = screen.getByText("Alice S.");
		expect(summary).toBeInTheDocument();
		expect(summary.tagName).toBe("SUMMARY");

		// Click to expand
		fireEvent.click(summary);

		// Check that the logout button is present
		expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
	});
});
