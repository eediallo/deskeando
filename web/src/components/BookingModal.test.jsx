import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import BookingModal from "./BookingModal";

describe("BookingModal component", () => {
	// Mock functions
	const onCloseMock = vi.fn();
	const onBookMock = vi.fn();
	const onCancelMock = vi.fn();

	// Mock data
	const mockDesk = { id: "1", name: "Desk A1" };
	const mockUsers = [
		{ id: "user1", firstName: "Alice", lastName: "Smith" },
		{ id: "user2", firstName: "Bob", lastName: "Jones" },
	];

	// Reset mocks between tests
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should not render when desk is not provided", () => {
		render(
			<BookingModal
				desk={null}
				booking={null}
				onClose={onCloseMock}
				onBook={onBookMock}
				onCancel={onCancelMock}
				currentUserId="user1"
				users={mockUsers}
			/>,
		);

		// Check that nothing renders
		expect(document.body).toHaveTextContent("");
	});

	it("should render booking form when desk is available", () => {
		render(
			<BookingModal
				desk={mockDesk}
				booking={null}
				onClose={onCloseMock}
				onBook={onBookMock}
				onCancel={onCancelMock}
				currentUserId="user1"
				users={mockUsers}
			/>,
		);

		// Check header
		expect(screen.getByText(`Book Desk ${mockDesk.name}`)).toBeInTheDocument();

		// Check date input
		expect(screen.getByLabelText(/Choose Date/i)).toBeInTheDocument();

		// Check book button
		const bookButton = screen.getByText(/Book this desk/i);
		expect(bookButton).toBeInTheDocument();

		// Test booking action
		fireEvent.click(bookButton);
		expect(onBookMock).toHaveBeenCalledWith(mockDesk.id, expect.any(String));
	});

	it("should render user's booking information when user has booked the desk", () => {
		const userBooking = { booking_id: "booking1", user_id: "user1" };

		render(
			<BookingModal
				desk={mockDesk}
				booking={userBooking}
				onClose={onCloseMock}
				onBook={onBookMock}
				onCancel={onCancelMock}
				currentUserId="user1"
				users={mockUsers}
			/>,
		);

		// Check for my booking section
		expect(
			screen.getByRole("heading", { name: "My Booking" }),
		).toBeInTheDocument();
		expect(
			screen.getByText(`You have booked ${mockDesk.name}.`),
		).toBeInTheDocument();

		// Check cancel button
		const cancelButton = screen.getByText(/Cancel my booking/i);
		expect(cancelButton).toBeInTheDocument();

		// Test cancel action
		fireEvent.click(cancelButton);
		expect(onCancelMock).toHaveBeenCalledWith(userBooking.booking_id);
	});

	it("should show another user's booking information", () => {
		const otherUserBooking = { booking_id: "booking2", user_id: "user2" };

		render(
			<BookingModal
				desk={mockDesk}
				booking={otherUserBooking}
				onClose={onCloseMock}
				onBook={onBookMock}
				onCancel={onCancelMock}
				currentUserId="user1"
				users={mockUsers}
			/>,
		);

		// Check for desk booked message
		expect(screen.getByText(/Desk Booked/i)).toBeInTheDocument();
		expect(
			screen.getByText(`${mockDesk.name} is booked by Bob Jones.`),
		).toBeInTheDocument();
	});

	it("should display error message when provided", () => {
		const errorMessage = "Failed to book desk";

		render(
			<BookingModal
				desk={mockDesk}
				booking={null}
				onClose={onCloseMock}
				onBook={onBookMock}
				onCancel={onCancelMock}
				currentUserId="user1"
				users={mockUsers}
				error={errorMessage}
			/>,
		);

		// Check for error message
		expect(screen.getByText(errorMessage)).toBeInTheDocument();
	});

	it("should close modal when close button is clicked", () => {
		render(
			<BookingModal
				desk={mockDesk}
				booking={null}
				onClose={onCloseMock}
				onBook={onBookMock}
				onCancel={onCancelMock}
				currentUserId="user1"
				users={mockUsers}
			/>,
		);

		// Check close button
		const closeButton = screen.getByText(/Close/i);
		expect(closeButton).toBeInTheDocument();

		// Test close action
		fireEvent.click(closeButton);
		expect(onCloseMock).toHaveBeenCalled();
	});

	it("should close modal when clicking on the overlay", () => {
		render(
			<BookingModal
				desk={mockDesk}
				booking={null}
				onClose={onCloseMock}
				onBook={onBookMock}
				onCancel={onCancelMock}
				currentUserId="user1"
				users={mockUsers}
			/>,
		);

		// Get the overlay element
		const overlay = screen.getByRole("button", { name: /Close modal/i });

		// Test close action on overlay click
		fireEvent.click(overlay);
		expect(onCloseMock).toHaveBeenCalled();
	});

	it("should close modal on Escape key press", () => {
		render(
			<BookingModal
				desk={mockDesk}
				booking={null}
				onClose={onCloseMock}
				onBook={onBookMock}
				onCancel={onCancelMock}
				currentUserId="user1"
				users={mockUsers}
			/>,
		);

		// Get the overlay element
		const overlay = screen.getByRole("button", { name: /Close modal/i });

		// Test Escape key
		fireEvent.keyDown(overlay, { key: "Escape" });
		expect(onCloseMock).toHaveBeenCalled();
	});
});
