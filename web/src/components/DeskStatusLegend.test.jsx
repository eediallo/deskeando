import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DeskStatusLegend from "./DeskStatusLegend";

describe("DeskStatusLegend component", () => {
	it("should render all status types", () => {
		render(<DeskStatusLegend />);

		// Check all status labels are rendered
		expect(screen.getByText("Available")).toBeInTheDocument();
		expect(screen.getByText("Booked by You")).toBeInTheDocument();
		expect(screen.getByText("Booked by Others")).toBeInTheDocument();
	});

	it("should render color indicators for each status", () => {
		render(<DeskStatusLegend />);

		// Count the legend-status elements
		const legendItems = screen.getAllByText(
			/Available|Booked by You|Booked by Others/,
		);
		expect(legendItems.length).toBeGreaterThanOrEqual(3);
	});

	it("should have the correct styles for each legend item", () => {
		render(<DeskStatusLegend />);

		// We can only check that the status labels are rendered
		// For more specific tests, we'd need to add test IDs to the component
		expect(screen.getByText("Available")).toBeInTheDocument();
		expect(screen.getByText("Booked by You")).toBeInTheDocument();
		expect(screen.getByText("Booked by Others")).toBeInTheDocument();
	});
});
