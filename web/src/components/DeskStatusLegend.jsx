import PropTypes from "prop-types";
import "./DeskStatusLegend.css";

// DeskStatusLegend: shows desk status color legend
export default function DeskStatusLegend() {
	return (
		<div style={{ margin: "1rem 0" }}>
			<div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
				<LegendItem color="#81c784" label="Available" />
				<LegendItem color="#87ceeb" label="Booked by You" />
				<LegendItem color="#bdbdbd" label="Booked by Others" />
			</div>
		</div>
	);
}

function LegendItem({ color, label }) {
	return (
		<div className="legend-status">
			<span
				style={{
					// display: "inline-block",
					width: 24,
					height: 24,
					borderRadius: "50%",
					background: color,
					border: "2px solid #333",
				}}
			/>
			<span>{label}</span>
		</div>
	);
}

LegendItem.propTypes = {
	color: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
};
