import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import * as apiService from "../services/apiService";
import { server } from "../setupTests.js";

import Home from "./Home.jsx";

// Mock the API calls
vi.spyOn(apiService, "getBookingsFiltered").mockResolvedValue([]);

// Mock the components
vi.mock("../components/BookingModal", () => ({
	default: () => <div data-testid="booking-modal">Mocked Modal</div>,
}));

vi.mock("../components/DeskGrid", () => ({
	default: () => <div data-testid="desk-grid">Mocked Desk Grid</div>,
}));

vi.mock("../components/DeskStatusLegend", () => ({
	default: () => (
		<div data-testid="desk-status-legend">Mocked Status Legend</div>
	),
}));

// Mock the useAppContext hook
vi.mock("../context/useAppContext", () => ({
	useAppContext: () => ({
		desks: [],
		users: [],
		loading: false,
		error: null,
		currentUser: { id: "user1", firstName: "Test", lastName: "User" },
		notifyBookingChange: vi.fn(),
	}),
}));

describe("Home component", () => {
	beforeEach(() => server.use());

	it("should render the desk management interface", async () => {
		render(<Home />);

		// Check for heading
		expect(screen.getByText("Office Available Desks")).toBeInTheDocument();

		// Check for components
		await waitFor(() => {
			expect(screen.getByTestId("desk-status-legend")).toBeInTheDocument();
		});

		await waitFor(() => {
			expect(screen.getByTestId("desk-grid")).toBeInTheDocument();
		});

		// API should be called to get bookings
		expect(apiService.getBookingsFiltered).toHaveBeenCalled();
	});
});
