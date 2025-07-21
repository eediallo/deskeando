import { useState } from "react";

import BookingModal from "../components/BookingModal";
import DeskGrid from "../components/DeskGrid";
import MyBookings from "../components/MyBookings";
import { useAppContext } from "../context/useAppContext";
import { createBooking, deleteBooking } from "../services/apiService";

/* function formatUsername(user) {
	return `${user.first_name} ${user.last_name[0]}.`;
} */

const Home = () => {
	const { desks, bookings, users, loading, error, setBookings } =
		useAppContext();
	const [selectedDesk, setSelectedDesk] = useState(null);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	// Use the logged-in user from context
	const { currentUser } = useAppContext();
	const currentUserId = currentUser ? currentUser.id : null;

	// Filter bookings to only today's date
	const today = new Date().toISOString().split("T")[0];
	const todaysBookings = bookings.filter((b) => {
		const bookingDate = new Date(b.from_date).toISOString().split("T")[0];
		return bookingDate === today;
	});

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

	const handleBook = async (deskId) => {
		try {
			console.log("Booking attempt:", { userId: currentUserId, deskId });
			const bookingData = {
				userId: currentUserId,
				deskId,
			};
			const newBooking = await createBooking(bookingData);
			setBookings([...bookings, newBooking]);
		} catch (err) {
			alert(err.message || "Failed to book desk");
		}
		handleCloseModal();
	};

	const handleCancel = async (bookingId) => {
		try {
			await deleteBooking(bookingId);
			setBookings(bookings.filter((b) => b.booking_id !== bookingId));
		} catch (err) {
			alert(err.message || "Failed to cancel booking");
		}
		handleCloseModal();
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	if (!currentUserId) return <p>Please log in to book a desk.</p>;

	return (
		<div>
			<h1>Desk Booking</h1>
			<MyBookings />
			{/* {currentUser && (
				<p style={{ marginBottom: "1rem" }}>
					Logged in as: <strong>{formatUsername(currentUser)}</strong>
				</p>
			)} */}
			<DeskGrid
				desks={desks}
				bookings={todaysBookings}
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
