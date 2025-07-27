import {
	render,
	screen,
	fireEvent,
	waitFor,
	within,
} from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

import { AppContext } from "../context/AppContext";
import * as apiService from "../services/apiService";

import MyBookings from "./MyBookings";

// Directly spy on the module functions
vi.spyOn(apiService, "getMyBookings").mockResolvedValue({
	upcoming: [
		{
			booking_id: "booking1",
			desk_id: "desk1",
			desk_name: "Desk A1",
			from_date: "2025-08-01",
		},
	],
	past: [
		{
			booking_id: "booking2",
			desk_id: "desk2",
			desk_name: "Desk B2",
			from_date: "2025-07-01",
		},
	],
});

vi.spyOn(apiService, "deleteBooking").mockResolvedValue({ success: true });

// Mock the BookingModal component
vi.mock("./BookingModal", () => ({
	default: ({ onCancel, onClose }) => (
		<div data-testid="booking-modal">
			<button onClick={() => onCancel("mocked-booking-id")}>
				Cancel Booking
			</button>
			<button onClick={onClose}>Close Modal</button>
		</div>
	),
}));

describe("MyBookings component", () => {
	// Mock context values
	const mockContextValue = {
		users: [
			{ id: "user1", firstName: "Alice", lastName: "Smith" },
			{ id: "user2", firstName: "Bob", lastName: "Jones" },
		],
		currentUser: { id: "user1", email: "alice@example.com" },
		notifyBookingChange: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render loading state initially", () => {
		render(
			<AppContext.Provider value={mockContextValue}>
				<MyBookings />
			</AppContext.Provider>,
		);

		expect(screen.getByText(/Loading your bookings/i)).toBeInTheDocument();
	});

	it("should render upcoming bookings by default", async () => {
		render(
			<AppContext.Provider value={mockContextValue}>
				<MyBookings />
			</AppContext.Provider>,
		);

		// Should show loading initially
		expect(screen.getByText(/Loading your bookings/i)).toBeInTheDocument();

		// Wait for bookings to load and check for buttons
		await waitFor(() => {
			expect(screen.getByText("Cancel Booking")).toBeInTheDocument();
		});

		// Check that the upcoming tab is active
		const upcomingTab = screen.getByText("Upcoming");
		expect(upcomingTab).toHaveClass("active");
	});

	it("should switch between upcoming and past bookings", async () => {
		render(
			<AppContext.Provider value={mockContextValue}>
				<MyBookings />
			</AppContext.Provider>,
		);

		// Wait for loading to finish
		await waitFor(() => {
			expect(
				screen.queryByText(/Loading your bookings/i),
			).not.toBeInTheDocument();
		});

		// Click on Past tab
		fireEvent.click(screen.getByText("Past"));

		// Verify the API was called
		expect(apiService.getMyBookings).toHaveBeenCalled();

		// Check that the past tab is now active
		expect(screen.getByText("Past")).toHaveClass("active");
	});

	it("should show cancel button only for upcoming bookings", async () => {
		render(
			<AppContext.Provider value={mockContextValue}>
				<MyBookings />
			</AppContext.Provider>,
		);

		// Wait for loading to finish
		await waitFor(() => {
			expect(
				screen.queryByText(/Loading your bookings/i),
			).not.toBeInTheDocument();
		});

		// Check cancel button exists in upcoming tab
		expect(screen.getByText(/Cancel Booking/i)).toBeInTheDocument();

		// Click on past tab
		const pastTab = screen.getByText("Past");
		fireEvent.click(pastTab);

		// Wait for past bookings to load and check that past tab is active
		await waitFor(() => {
			expect(pastTab).toHaveClass("active");
		});

		// Check that cancel button doesn't exist
		await waitFor(() => {
			expect(screen.queryByText(/Cancel Booking/i)).not.toBeInTheDocument();
		});
	});

	it("should open modal when cancel booking is clicked", async () => {
		render(
			<AppContext.Provider value={mockContextValue}>
				<MyBookings />
			</AppContext.Provider>,
		);

		// Wait for loading to finish
		await waitFor(() => {
			expect(
				screen.queryByText(/Loading your bookings/i),
			).not.toBeInTheDocument();
		});

		// Click on Cancel Booking button
		fireEvent.click(screen.getByText("Cancel Booking"));

		// Check that modal is displayed
		expect(screen.getByTestId("booking-modal")).toBeInTheDocument();
	});

	it("should cancel booking and notify context when confirmed", async () => {
		// Use a mock function we can access later
		const notifyMock = vi.fn();
		const customContextValue = {
			...mockContextValue,
			notifyBookingChange: notifyMock,
		};

		render(
			<AppContext.Provider value={customContextValue}>
				<MyBookings />
			</AppContext.Provider>,
		);

		// Wait for loading to finish
		await waitFor(() => {
			expect(
				screen.queryByText(/Loading your bookings/i),
			).not.toBeInTheDocument();
		});

		// Click on Cancel Booking button to open modal
		fireEvent.click(screen.getByText("Cancel Booking"));

		// Click on Cancel Booking in the modal using within to scope the query to the modal
		const modal = screen.getByTestId("booking-modal");
		const { getByText } = within(modal);
		fireEvent.click(getByText("Cancel Booking"));

		// Verify deleteBooking was called
		expect(apiService.deleteBooking).toHaveBeenCalledWith("mocked-booking-id");

		// Verify context notification was called
		await waitFor(() => {
			expect(notifyMock).toHaveBeenCalled();
		});
	});

	it("should show error message when API call fails", async () => {
		// Mock API error
		apiService.getMyBookings.mockRejectedValueOnce(
			new Error("Failed to fetch bookings"),
		);

		render(
			<AppContext.Provider value={mockContextValue}>
				<MyBookings />
			</AppContext.Provider>,
		);

		// Wait for error message
		await waitFor(() => {
			expect(
				screen.getByText(/Error: Failed to fetch bookings/i),
			).toBeInTheDocument();
		});
	});

	it("should show message when no bookings exist", async () => {
		// Mock empty bookings
		apiService.getMyBookings.mockResolvedValueOnce({
			upcoming: [],
			past: [],
		});

		render(
			<AppContext.Provider value={mockContextValue}>
				<MyBookings />
			</AppContext.Provider>,
		);

		// Wait for no bookings message
		await waitFor(() => {
			expect(
				screen.getByText(/You have no upcoming bookings yet/i),
			).toBeInTheDocument();
		});
	});
});
