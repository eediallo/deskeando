import PropTypes from "prop-types";

// import Desk from "./Desk";
import "./DeskGrid.css";

const DeskGrid = ({ desks, bookings, onDeskClick, currentUserId }) => {
	const findBookingForDesk = (deskId) => {
		return bookings.find((b) => b.desk_id === deskId);
	};

	// Generate 50 desks if we don't have enough
	const allDesks = [];
	for (let i = 1; i <= 50; i++) {
		const existingDesk = desks.find((d) => d.name === `Desk ${i}`);
		if (existingDesk) {
			allDesks.push(existingDesk);
		} else {
			// Create a mock desk for display purposes
			allDesks.push({
				id: `mock-${i}`,
				name: `Desk ${i}`,
				...existingDesk,
			});
		}
	}

	// Define desk positions for office layout
	const deskPositions = [
		// Top wing (desks 1-12)
		...Array.from({ length: 12 }, (_, i) => ({
			id: allDesks[i].id,
			name: allDesks[i].name,
			x: 270 + i * 60,
			y: 80,
			desk: allDesks[i],
		})),
		// Left wing (desks 13-24)
		...Array.from({ length: 12 }, (_, i) => ({
			id: allDesks[i + 12].id,
			name: allDesks[i + 12].name,
			x: 80 + (i % 2) * 60,
			y: 200 + Math.floor(i / 2) * 60,
			desk: allDesks[i + 12],
		})),
		// Right wing (desks 25-36)
		...Array.from({ length: 12 }, (_, i) => ({
			id: allDesks[i + 24].id,
			name: allDesks[i + 24].name,
			x: 1020 + (i % 3) * 60,
			y: 200 + Math.floor(i / 3) * 60,
			desk: allDesks[i + 24],
		})),
		// Middle section (desks 37-50)
		...Array.from({ length: 14 }, (_, i) => ({
			id: allDesks[i + 36].id,
			name: allDesks[i + 36].name,
			x: 400 + (i % 5) * 80,
			y: 250 + Math.floor(i / 5) * 80,
			desk: allDesks[i + 36],
		})),
	];

	return (
		<div className="office-layout" data-testid="desk-grid">
			<svg width="1200" height="600" viewBox="0 0 1200 600">
				{/* Office background */}
				<rect
					width="1200"
					height="600"
					fill="#f8f9fa"
					stroke="#dee2e6"
					strokeWidth="2"
				/>

				{/* Wing dividers */}
				<line
					x1="0"
					y1="150"
					x2="1200"
					y2="150"
					stroke="#adb5bd"
					strokeWidth="3"
					strokeDasharray="5,5"
				/>
				<line
					x1="220"
					y1="0"
					x2="220"
					y2="600"
					stroke="#adb5bd"
					strokeWidth="3"
					strokeDasharray="5,5"
				/>
				<line
					x1="980"
					y1="0"
					x2="980"
					y2="600"
					stroke="#adb5bd"
					strokeWidth="3"
					strokeDasharray="5,5"
				/>

				{/* Wing labels */}
				<text
					x="600"
					y="30"
					textAnchor="middle"
					fontSize="16"
					fontWeight="bold"
					fill="#495057"
				>
					North Wing
				</text>
				<text
					x="30"
					y="300"
					textAnchor="middle"
					fontSize="16"
					fontWeight="bold"
					fill="#495057"
					transform="rotate(-90, 30, 300)"
				>
					West Wing
				</text>
				<text
					x="1175"
					y="300"
					textAnchor="middle"
					fontSize="16"
					fontWeight="bold"
					fill="#495057"
					transform="rotate(90, 1175, 300)"
				>
					East Wing
				</text>
				<text
					x="600"
					y="170"
					textAnchor="middle"
					fontSize="16"
					fontWeight="bold"
					fill="#495057"
				>
					Central Area
				</text>

				{/* Plant Icon - Left side */}
				<g transform="translate(110, 37) scale(1.5)">
					<circle cx="15" cy="15" r="8" fill="#ff0000" />
					<circle cx="15" cy="15" r="4" fill="#ffff00" />
					<rect x="14" y="23" width="2" height="12" fill="#008080" />
					<ellipse cx="12" cy="28" rx="3" ry="2" fill="#90ee90" />
					<ellipse cx="18" cy="32" rx="3" ry="2" fill="#90ee90" />
					<rect x="8" y="35" width="14" height="8" fill="#ff69b4" />
					<rect x="8" y="35" width="14" height="2" fill="#800080" />
				</g>

				{/* Kitchen and Meeting Room in East Wing */}
				<rect
					x="1010"
					y="520"
					width="160"
					height="60"
					fill="#fff3cd"
					stroke="#ffc107"
					strokeWidth="2"
					rx="5"
				/>
				<text
					x="1090"
					y="550"
					textAnchor="middle"
					fontSize="12"
					fontWeight="bold"
					fill="#856404"
				>
					Kitchen
				</text>

				<rect
					x="1010"
					y="450"
					width="160"
					height="60"
					fill="#d1ecf1"
					stroke="#17a2b8"
					strokeWidth="2"
					rx="5"
				/>
				<text
					x="1090"
					y="480"
					textAnchor="middle"
					fontSize="12"
					fontWeight="bold"
					fill="#0c5460"
				>
					Meeting Room
				</text>

				{/* Meeting Room in West Wing */}
				<rect
					x="40"
					y="540"
					width="140"
					height="50"
					fill="#d1ecf1"
					stroke="#17a2b8"
					strokeWidth="2"
					rx="5"
				/>
				<text
					x="110"
					y="565"
					textAnchor="middle"
					fontSize="12"
					fontWeight="bold"
					fill="#0c5460"
				>
					Meeting Room
				</text>

				{/* Entrance in Central Area */}
				<rect
					x="500"
					y="570"
					width="200"
					height="30"
					fill="#e8f5e8"
					stroke="#28a745"
					strokeWidth="2"
					rx="5"
				/>
				<text
					x="600"
					y="590"
					textAnchor="middle"
					fontSize="14"
					fontWeight="bold"
					fill="#155724"
				>
					ENTRANCE
				</text>

				{/* Desks */}
				{deskPositions.map(({ id, name, x, y, desk }) => (
					<g key={id}>
						<rect
							x={x - 25}
							y={y - 20}
							width="50"
							height="40"
							rx="3"
							fill={getDeskColor(
								desk,
								findBookingForDesk(desk.id),
								currentUserId,
							)}
							stroke="#6c757d"
							strokeWidth="1"
							cursor="pointer"
							onClick={() => onDeskClick(desk, findBookingForDesk(desk.id))}
						/>
						<text
							x={x}
							y={y + 5}
							textAnchor="middle"
							fontSize="10"
							fill="#495057"
							pointerEvents="none"
						>
							{name}
						</text>
					</g>
				))}
			</svg>
		</div>
	);
};

const getDeskColor = (desk, booking, currentUserId) => {
	if (!booking) {
		return "#90ee90"; // Available - light green
	}
	if (String(booking.user_id) === String(currentUserId)) {
		return "#87ceeb"; // User booked - light blue
	}
	return "#d3d3d3"; // Unavailable - light gray
};

export default DeskGrid;

DeskGrid.propTypes = {
	desks: PropTypes.array.isRequired,
	bookings: PropTypes.array.isRequired,
	onDeskClick: PropTypes.func.isRequired,
	currentUserId: PropTypes.string,
};
