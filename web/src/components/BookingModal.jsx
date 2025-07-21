import PropTypes from "prop-types";
import { useState } from "react";
import "./BookingModal.css";

const BookingModal = ({
	desk,
	booking,
	onClose,
	onBook,
	onCancel,
	currentUserId,
	users,
}) => {
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split("T")[0],
	);

	if (!desk) return null;

	const findUser = (userId) => {
		return users.find((u) => u.id === userId);
	};

	const renderContent = () => {
		if (!booking) {
			const today = new Date().toISOString().split("T")[0];
			return (
				<>
					<h2>Book Desk {desk.name}</h2>
					<label htmlFor="booking-date">Choose Date: </label>
					<input
						type="date"
						id="booking-date"
						name="booking-date"
						min={today}
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
					></input>
					<button onClick={() => onBook(desk.id, selectedDate)}>
						Book this desk
					</button>
				</>
			);
		}

		const user = findUser(booking.user_id);

		if (booking.user_id === currentUserId) {
			return (
				<>
					<h2>My Booking</h2>
					<p>You have booked {desk.name}.</p>
					<button onClick={() => onCancel(booking.booking_id)}>
						Cancel my booking
					</button>
				</>
			);
		}

		return (
			<>
				<h2>Desk Booked</h2>
				<p>
					{desk.name} is booked by{" "}
					{user ? `${user.firstName} ${user.lastName}` : "another user"}.
				</p>
			</>
		);
	};

	return (
		<div
			className="modal-overlay"
			role="button"
			tabIndex={0}
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
					onClose();
				}
			}}
			aria-label="Close modal"
		>
			<div className="modal-content">
				{renderContent()}
				{/* The close button is already interactive and has a click handler. */}
				{/* No additional keyboard listener is needed for the button itself. */}
				{/* The modal overlay already handles keyboard events for closing the modal. */}
				{/* This comment is added to clarify that the fix is applied to the modal-overlay, */}
				{/* and the button itself is correctly implemented. */}

				<button onClick={onClose}>Close</button>
			</div>
		</div>
	);
};
BookingModal.propTypes = {
	desk: PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		name: PropTypes.string,
	}),
	booking: PropTypes.shape({
		booking_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	}),
	onClose: PropTypes.func.isRequired,
	onBook: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		.isRequired,
	users: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			firstName: PropTypes.string,
			lastName: PropTypes.string,
		}),
	).isRequired,
};

export default BookingModal;
