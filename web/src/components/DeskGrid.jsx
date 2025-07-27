import PropTypes from "prop-types";

import Desk from "./Desk";
import "./DeskGrid.css";

const DeskGrid = ({ desks, bookings, onDeskClick, currentUserId }) => {
	const findBookingForDesk = (deskId) => {
		return bookings.find((b) => b.desk_id === deskId);
	};

	return (
		<div className="desk-grid" data-testid="desk-grid">
			{desks.map((desk) => (
				<Desk
					key={desk.id}
					desk={desk}
					booking={findBookingForDesk(desk.id)}
					onClick={onDeskClick}
					currentUserId={currentUserId}
				/>
			))}
		</div>
	);
};

export default DeskGrid;

DeskGrid.propTypes = {
	desks: PropTypes.array.isRequired,
	bookings: PropTypes.array.isRequired,
	onDeskClick: PropTypes.func.isRequired,
	currentUserId: PropTypes.string,
};
