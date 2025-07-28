import PropTypes from "prop-types";
import { useEffect, useState, useContext } from "react";

import { AppContext } from "../context/AppContext";
import { getMyBookings, deleteBooking } from "../services/apiService";

import BookingModal from "./BookingModal";

import "./MyBookings.css";

const MyBookings = ({ myBookings }) => {
	const [tab, setTab] = useState("upcoming");
	console.log("My Booking render: ", myBookings);
	const today = new Date().toISOString().split("T")[0];
	const upcoming = myBookings.filter(
		(b) => new Date(b.from_date) >= new Date(today),
	);
	const past = myBookings.filter(
		(b) => new Date(b.from_date) < new Date(today),
	);

	const sortByDateAsc = (a, b) => new Date(a.from_date) - new Date(b.from_date);
	const displayedBookings =
		tab === "upcoming"
			? [...upcoming].sort(sortByDateAsc)
			: [...past].sort(sortByDateAsc);

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
			setUpcoming((prev) => prev.filter((b) => b.booking_id !== bookingId));
			notifyBookingChange();
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
							Desk: <strong>{booking.desk_name || booking.desk_id}</strong>
							<br />
							Date: {new Date(booking.from_date).toLocaleDateString()} <br />
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
				/>
			)}
		</div>
	);
};

MyBookings.propTypes = {
	myBookings: PropTypes.array,
};

export default MyBookings;
