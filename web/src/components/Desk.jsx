import "./Desk.css";
import PropTypes from "prop-types";

const Desk = ({ desk, booking, onClick, currentUserId }) => {
	const getDeskClassName = () => {
		if (!booking) {
			return "desk-available";
		}
		if (String(booking.user_id) === String(currentUserId)) {
			return "desk-user-booked";
		}
		return "desk-unavailable";
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter" || event.key === " ") {
			onClick(desk, booking);
		}
	};

	return (
		<div
			className={`desk ${getDeskClassName()}`}
			onClick={() => onClick(desk, booking)}
			onKeyDown={handleKeyDown}
			role="button"
			tabIndex={0}
		>
			{desk.name}
		</div>
	);
};

export default Desk;

Desk.propTypes = {
	desk: PropTypes.object.isRequired,
	booking: PropTypes.object,
	onClick: PropTypes.func.isRequired,
	currentUserId: PropTypes.string,
};
