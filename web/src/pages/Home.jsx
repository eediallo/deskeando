import { useState } from "react";

import BookingModal from "../components/BookingModal";
import DeskGrid from "../components/DeskGrid";
import { useAppContext } from "../context/useAppContext";

// API calls temporarily commented out
// import { createBooking, deleteBooking } from '../services/apiService';

const Home = () => {
	const { desks, bookings, users, loading, error, setBookings } =
		useAppContext();
	const [selectedDesk, setSelectedDesk] = useState(null);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Hardcoded current user ID
	const currentUserId = 1;

	const handleDeskClick = (desk, booking) => {
		setSelectedDesk(desk);
		setSelectedBooking(booking);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedDesk(null);
		setSelectedBooking(null);
	};

	const handleBook = (deskId) => {
		const userHasBooking = bookings.some(
			(booking) => booking.user_id === currentUserId,
		);
		if (userHasBooking) {
			alert("You can only book one desk per day.");
			handleCloseModal();
			return;
		}
		// Using mock data
		const newBooking = {
			booking_id: Date.now(), // Simple unique ID for mock
			desk_id: deskId,
			user_id: currentUserId,
			from_date: new Date().toISOString(),
			to_date: new Date().toISOString(),
			user: users.find((u) => u.id === currentUserId),
			desk: desks.find((d) => d.id === deskId),
		};
		setBookings([...bookings, newBooking]);
		handleCloseModal();
	};

	const handleCancel = (bookingId) => {
		// Using mock data
		setBookings(bookings.filter((b) => b.booking_id !== bookingId));
		handleCloseModal();
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<div>
			<h1>Desk Booking</h1>
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
				/>
			)}
		</div>
	);
};

export default Home;
