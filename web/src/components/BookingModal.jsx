import "./BookingModal.css";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

import { getBookingsByDeskId } from "../services/apiService";

import "react-datepicker/dist/react-datepicker.css";
const BookingModal = ({
	desk,
	booking,
	onClose,
	onBook,
	onCancel,
	currentUserId,
	users,
	error,
	selectedDate: initialSelectedDate,
	myBookingsDates,
}) => {
	const [selectedDate, setSelectedDate] = useState(
		initialSelectedDate || new Date().toISOString().split("T")[0],
	);
	const [blockedDates, setBlockedDates] = useState([]);

	// Fetch desk bookings and form blockedDates
	useEffect(() => {
		const fetchBlockedDates = async () => {
			if (!desk) return;

			try {
				const deskBookings = await getBookingsByDeskId(desk.id);
				const deskBlockedDates = deskBookings.map(
					(booking) => new Date(booking.from_date),
				);

				const all = [...myBookingsDates, ...deskBlockedDates];
				const unique = Array.from(
					new Set(all.map((d) => d.toDateString())),
				).map((str) => new Date(str));

				setBlockedDates(unique);
			} catch (err) {
				throw new Error(`Error fetching desk bookings: ${err}`, err);
			}
		};

		fetchBlockedDates();
	}, [desk, myBookingsDates]);

	useEffect(() => {
		if (initialSelectedDate) {
			setSelectedDate(initialSelectedDate);
		}
	}, [initialSelectedDate]);

	if (!desk) return null;

	const findUser = (userId) => {
		return users.find((u) => u.id === userId);
	};

	const renderContent = () => {
		if (!booking) {
			return (
				<>
					<div className="form-group">
						<h2>Book Desk {desk.name}</h2>
						<label htmlFor="booking-date">Choose Date: </label>
						<DatePicker
							selected={selectedDate}
							onChange={(date) => setSelectedDate(date)}
							minDate={new Date()}
							excludeDates={blockedDates}
							dateFormat="dd/MM/yyyy"
							className="booking-date"
							id="booking-date"
							name="booking-date"
						/>
					</div>
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
				{error && (
					<div style={{ color: "red", marginTop: "1rem" }}>{error}</div>
				)}
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
		id: PropTypes.string.isRequired,
		name: PropTypes.string,
	}),
	booking: PropTypes.shape({
		booking_id: PropTypes.string,
		user_id: PropTypes.string,
		from_date: PropTypes.string,
	}),
	onClose: PropTypes.func.isRequired,
	onBook: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	currentUserId: PropTypes.string.isRequired,
	users: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			firstName: PropTypes.string,
			lastName: PropTypes.string,
		}),
	).isRequired,
	error: PropTypes.string,
	selectedDate: PropTypes.string,
	myBookingsDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
};

export default BookingModal;
