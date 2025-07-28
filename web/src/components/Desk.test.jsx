import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Desk from "./Desk";

describe("Desk component", () => {
	// Mock function
	const onClickMock = vi.fn();

	// Mock data
	const mockDesk = { id: "1", name: "Desk A1" };

	// Reset mock before each test
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should render available desk correctly", () => {
		render(
			<Desk
				desk={mockDesk}
				booking={null}
				onClick={onClickMock}
				currentUserId="user1"
			/>,
		);

		// Check desk name is displayed
		const deskElement = screen.getByText(mockDesk.name);
		expect(deskElement).toBeInTheDocument();

		// Check desk has the correct class for available status
		const availableDesk = screen.getByRole("button", { name: mockDesk.name });
		expect(availableDesk).toHaveClass("desk-available");
	});

	it("should render user-booked desk correctly", () => {
		const userBooking = { user_id: "user1" };

		render(
			<Desk
				desk={mockDesk}
				booking={userBooking}
				onClick={onClickMock}
				currentUserId="user1"
			/>,
		);

		// Check desk name is displayed
		const deskElement = screen.getByText(mockDesk.name);
		expect(deskElement).toBeInTheDocument();

		// Check desk has the correct class for user-booked status
		const deskButton = screen.getByRole("button", { name: mockDesk.name });
		expect(deskButton).toHaveClass("desk-user-booked");
	});

	it("should render unavailable desk correctly", () => {
		const otherUserBooking = { user_id: "user2" };

		render(
			<Desk
				desk={mockDesk}
				booking={otherUserBooking}
				onClick={onClickMock}
				currentUserId="user1"
			/>,
		);

		// Check desk name is displayed
		const deskElement = screen.getByText(mockDesk.name);
		expect(deskElement).toBeInTheDocument();

		// Check desk has the correct class for unavailable status
		const deskButton = screen.getByRole("button", { name: mockDesk.name });
		expect(deskButton).toHaveClass("desk-unavailable");
	});

	it("should call onClick when desk is clicked", () => {
		render(
			<Desk
				desk={mockDesk}
				booking={null}
				onClick={onClickMock}
				currentUserId="user1"
			/>,
		);

		// Click the desk
		fireEvent.click(screen.getByText(mockDesk.name));

		// Check onClick was called with correct arguments
		expect(onClickMock).toHaveBeenCalledWith(mockDesk, null);
	});

	it("should call onClick when Enter key is pressed", () => {
		render(
			<Desk
				desk={mockDesk}
				booking={null}
				onClick={onClickMock}
				currentUserId="user1"
			/>,
		);

		// Simulate Enter key press
		fireEvent.keyDown(screen.getByText(mockDesk.name), { key: "Enter" });

		// Check onClick was called with correct arguments
		expect(onClickMock).toHaveBeenCalledWith(mockDesk, null);
	});

	it("should call onClick when Space key is pressed", () => {
		render(
			<Desk
				desk={mockDesk}
				booking={null}
				onClick={onClickMock}
				currentUserId="user1"
			/>,
		);

		// Simulate Space key press
		fireEvent.keyDown(screen.getByText(mockDesk.name), { key: " " });

		// Check onClick was called with correct arguments
		expect(onClickMock).toHaveBeenCalledWith(mockDesk, null);
	});

	it("should have correct accessibility attributes", () => {
		render(
			<Desk
				desk={mockDesk}
				booking={null}
				onClick={onClickMock}
				currentUserId="user1"
			/>,
		);

		// Check desk has correct role and tabIndex for accessibility
		const deskButton = screen.getByRole("button", { name: mockDesk.name });
		expect(deskButton).toHaveAttribute("role", "button");
		expect(deskButton).toHaveAttribute("tabIndex", "0");
	});
});
