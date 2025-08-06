import PropTypes from "prop-types";
import { useState, useContext } from "react";

import { AppContext } from "../context/AppContext";
import { deleteBooking } from "../services/apiService";

import BookingModal from "./BookingModal";
import "./MyBookings.css";

const sortByDateAsc = (a, b) => new Date(a.from_date) - new Date(b.from_date);

const MyBookings = () => {
	const [tab, setTab] = useState("upcoming");
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedDate] = useState(new Date().toISOString().split("T")[0]);

	const { users, currentUser, loading, error, myBookings, setMyBookings } =
		useContext(AppContext);

	const displayedBookings =
		tab === "upcoming"
			? [...(myBookings?.upcoming || [])].sort(sortByDateAsc)
			: [...(myBookings?.past || [])].sort(sortByDateAsc);

	const openModal = (booking) => {
		setSelectedBooking(booking);
		setModalVisible(true);
	};

	const closeModal = () => {
		setSelectedBooking(null);
		setModalVisible(false);
	};

	const handleCancel = async (bookingId) => {
		try {
			await deleteBooking(bookingId);
			setMyBookings((prev) => {
				const updatedUpcoming = prev.upcoming.filter(
					(b) => b.booking_id !== bookingId,
				);

				const updatedPast = prev.past.filter((b) => b.booking_id !== bookingId);

				return {
					upcoming: updatedUpcoming,
					past: updatedPast,
				};
			});
			closeModal();
		} catch (err) {
			alert("Failed to cancel booking: " + err.message);
		}
	};

	return (
		<div className="my-bookings-container">
			{/* <h2>My Bookings</h2> */}
			<div className="my-bookings-tabs">
				<button
					className={tab === "upcoming" ? "active" : ""}
					onClick={() => setTab("upcoming")}
				>
					Upcoming
				</button>
				<button
					className={tab === "past" ? "active" : ""}
					onClick={() => setTab("past")}
				>
					Past
				</button>
			</div>
			{loading ? (
				<div>Loading your bookings...</div>
			) : error ? (
				<div>Error: {error.message}</div>
			) : !displayedBookings.length ? (
				<div>You have no {tab} bookings yet.</div>
			) : (
				<ul>
					{displayedBookings.map((booking) => (
						<li key={booking.booking_id}>
							Desk: <strong>{booking.desk_name || booking.desk_id}</strong>{" "}
							<br />
							Date: {new Date(booking.from_date).toLocaleDateString(
								"en-GB",
							)}{" "}
							<br />
							{tab === "upcoming" && (
								<button onClick={() => openModal(booking)}>
									Cancel Booking
								</button>
							)}
						</li>
					))}
				</ul>
			)}

			{modalVisible && selectedBooking && (
				<BookingModal
					desk={{
						id: selectedBooking.desk_id,
						name:
							selectedBooking.desk_name || `Desk ${selectedBooking.desk_id}`,
					}}
					booking={selectedBooking}
					onClose={closeModal}
					onBook={() => {}}
					onCancel={handleCancel}
					currentUserId={currentUser?.id}
					users={users}
					error={error?.message}
					selectedDate={selectedDate}
					myBookingsDates={myBookings.upcoming.map(
						(booking) => new Date(booking.from_date),
					)}
				/>
			)}
		</div>
	);
};

MyBookings.propTypes = {
	myBookings: PropTypes.shape({
		upcoming: PropTypes.array,
		past: PropTypes.array,
	}).isRequired,
	refreshBookings: PropTypes.func.isRequired,
	currentUser: PropTypes.object,
	users: PropTypes.array,
	loading: PropTypes.bool,
	error: PropTypes.object,
};

export default MyBookings;
