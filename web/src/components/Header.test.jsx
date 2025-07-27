import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { useAppContext } from "../context/useAppContext";

import Header from "./Header";

// Mock the context hook
vi.mock("../context/useAppContext", () => ({
	useAppContext: vi.fn(),
}));

describe("Header component", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should render login and sign up links when not authenticated", () => {
		// Set up the mock context for non-authenticated user
		useAppContext.mockReturnValue({
			isAuthenticated: false,
		});

		render(
			<BrowserRouter>
				<Header />
			</BrowserRouter>,
		);

		// Check if login and signup links are present
		expect(screen.getByText("Login")).toBeInTheDocument();
		expect(screen.getByText("Sign Up")).toBeInTheDocument();

		// Logo should always be present
		expect(screen.getByAltText("logo")).toBeInTheDocument();
	});

	it("should render home and calendar links when authenticated", () => {
		// Set up the mock context for authenticated user
		useAppContext.mockReturnValue({
			isAuthenticated: true,
		});

		render(
			<BrowserRouter>
				<Header />
			</BrowserRouter>,
		);

		// Check if home and calendar links are present
		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("Calendar")).toBeInTheDocument();

		// And login/signup links are not present
		expect(screen.queryByText("Login")).not.toBeInTheDocument();
		expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();

		// Logo should always be present
		expect(screen.getByAltText("logo")).toBeInTheDocument();
	});

	it("should have correct link hrefs", () => {
		// Set up the mock context for non-authenticated user
		useAppContext.mockReturnValue({
			isAuthenticated: false,
		});

		render(
			<BrowserRouter>
				<Header />
			</BrowserRouter>,
		);

		// Check if links have correct hrefs
		expect(screen.getByText("Login")).toHaveAttribute("href", "/login");
		expect(screen.getByText("Sign Up")).toHaveAttribute("href", "/register");

		// Logo link should point to home
		const logoLink = screen.getByRole("link", { name: /logo/i });
		expect(logoLink).toHaveAttribute("href", "/");
	});
});
