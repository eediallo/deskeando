import { useEffect, useState } from "react";

import BookingModal from "../components/BookingModal";
import DeskGrid from "../components/DeskGrid";
import { useAppContext } from "../context/useAppContext";
import {
	createBooking,
	deleteBooking,
	getBookingsFiltered,
} from "../services/apiService";

const Home = () => {
	const { desks, users, loading, error } = useAppContext();
	const [bookings, setBookings] = useState([]);
	const [selectedDesk, setSelectedDesk] = useState(null);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalError, setModalError] = useState("");
	// Use the logged-in user from context
	const { currentUser } = useAppContext();
	const currentUserId = currentUser ? String(currentUser.id) : null;

	// Debug log
	console.log("bookings:", bookings, "currentUserId:", currentUserId);

	useEffect(() => {
		if (!currentUserId) return;
		const today = new Date().toISOString().split("T")[0];
		getBookingsFiltered({ from: today, to: today })
			.then(setBookings)
			.catch((err) => alert(err.message || "Failed to fetch bookings"));
		const intervalId = setInterval(() => {
			getBookingsFiltered({ from: today, to: today })
				.then(setBookings)
				.catch(() => {});
		}, 5000);
		return () => clearInterval(intervalId);
	}, [currentUserId]);

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

	const handleBook = async (deskId) => {
		try {
			const bookingData = {
				userId: currentUserId,
				deskId,
			};
			const newBooking = await createBooking(bookingData);
			setBookings([...bookings, newBooking]);
			handleCloseModal();
		} catch (err) {
			setModalError(err.message || "Failed to book desk");
		}
	};

	const handleCancel = async (bookingId) => {
		try {
			await deleteBooking(bookingId);
			setBookings(bookings.filter((b) => b.booking_id !== bookingId));
			handleCloseModal();
		} catch (err) {
			setModalError(err.message || "Failed to cancel booking");
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	if (!currentUserId) return <p>Please log in to book a desk.</p>;

	return (
		<div>
			<h1>Desk Booking</h1>
			{/* {currentUser && (
				<p style={{ marginBottom: "1rem" }}>
					Logged in as: <strong>{formatUsername(currentUser)}</strong>
				</p>
			)} */}
			<DeskGrid
				desks={desks}
				bookings={bookings}
				onDeskClick={handleDeskClick}
				currentUserId={currentUserId}
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
				/>
			)}
		</div>
	);
};

export default Home;
