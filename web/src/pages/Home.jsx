import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import BookingModal from "../components/BookingModal";
import DeskGrid from "../components/DeskGrid";
import DeskStatusLegend from "../components/DeskStatusLegend";
import { useAppContext } from "../context/useAppContext";
import {
	createBooking,
	deleteBooking,
	getBookingsFiltered,
} from "../services/apiService";
import "./Home.css";

const Home = ({ myBookings, refreshBookings }) => {
	const { desks, users, loading, error, currentUser } = useAppContext();

	const [bookings, setBookings] = useState([]);
	const [selectedDesk, setSelectedDesk] = useState(null);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalError, setModalError] = useState("");
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split("T")[0],
	);
	const currentUserId = currentUser ? String(currentUser.id) : null;

	useEffect(() => {
		if (!currentUserId) return;
		getBookingsFiltered({ from: selectedDate, to: selectedDate })
			.then(setBookings)
			.catch((err) => alert(err.message || "Failed to fetch bookings"));
		const intervalId = setInterval(() => {
			getBookingsFiltered({ from: selectedDate, to: selectedDate })
				.then(setBookings)
				.catch(() => {});
		}, 5000);
		return () => clearInterval(intervalId);
	}, [currentUserId, selectedDate]);

	const handleDeskClick = (desk, booking) => {
		setSelectedDesk(desk);
		setSelectedBooking(booking);
		setModalError("");
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedDesk(null);
		setSelectedBooking(null);
		setModalError("");
	};

	const handleBook = async (deskId, selectedDate) => {
		try {
			const bookingData = {
				userId: currentUserId,
				deskId,
				bookingDate: selectedDate,
			};
			const newBooking = await createBooking(bookingData);
			setBookings([...bookings, newBooking]);

			await refreshBookings();

			handleCloseModal();
		} catch (err) {
			setModalError(err.message || "Failed to book desk");
		}
	};

	const handleCancel = async (bookingId) => {
		try {
			await deleteBooking(bookingId);
			setBookings(bookings.filter((b) => b.booking_id !== bookingId));
			await refreshBookings();
			handleCloseModal();
		} catch (err) {
			setModalError(err.message || "Failed to cancel booking");
		}
	};

	const goToPreviousDay = () => {
		const date = new Date(selectedDate);
		date.setDate(date.getDate() - 1);
		setSelectedDate(date.toISOString().split("T")[0]);
	};

	const goToNextDay = () => {
		const date = new Date(selectedDate);
		date.setDate(date.getDate() + 1);
		setSelectedDate(date.toISOString().split("T")[0]);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	if (!currentUserId) return <p>Please log in to book a desk.</p>;

	return (
		<div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
			<div style={{ flex: 2 }}>
				<h1>Office Available Desks</h1>
				<DeskStatusLegend />

				<div className="date-navigation">
					<button onClick={goToPreviousDay} className="nav-button">
						← Previous
					</button>

					<div className="date-display">
						<h3>{formatDate(selectedDate)}</h3>
					</div>

					<button onClick={goToNextDay} className="nav-button">
						Next →
					</button>
				</div>

				<DeskGrid
					desks={desks}
					bookings={bookings}
					onDeskClick={handleDeskClick}
					currentUserId={currentUserId}
					selectedDate={selectedDate}
				/>
				{isModalOpen && (
					<BookingModal
						desk={selectedDesk}
						booking={selectedBooking}
						onClose={handleCloseModal}
						onBook={handleBook}
						onCancel={handleCancel}
						currentUserId={currentUserId}
						users={users}
						error={modalError}
						selectedDate={selectedDate}
						myBookingsDates={myBookings.upcoming.map(
							(booking) => new Date(booking.from_date),
						)}
					/>
				)}
			</div>
		</div>
	);
};

Home.propTypes = {
	myBookings: PropTypes.shape({
		upcoming: PropTypes.arrayOf(
			PropTypes.shape({
				from_date: PropTypes.string.isRequired,
			}),
		).isRequired,
	}).isRequired,
	refreshBookings: PropTypes.func.isRequired,
};

export default Home;
