import { useEffect, useState } from "react";

import BookingModal from "../components/BookingModal";
import DeskGrid from "../components/DeskGrid";
import DeskStatusLegend from "../components/DeskStatusLegend";
import MyBookings from "../components/MyBookings";
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
	const [myBookingsRefresh, setMyBookingsRefresh] = useState(0);
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

	const handleBook = async (deskId, selectedDate) => {
		try {
			const bookingData = {
				userId: currentUserId,
				deskId,
				bookingDate: selectedDate,
			};
			const newBooking = await createBooking(bookingData);
			setBookings([...bookings, newBooking]);
			setMyBookingsRefresh((r) => r + 1); // trigger refresh
			handleCloseModal();
		} catch (err) {
			setModalError(err.message || "Failed to book desk");
		}
	};

	const handleCancel = async (bookingId) => {
		try {
			await deleteBooking(bookingId);
			setBookings(bookings.filter((b) => b.booking_id !== bookingId));
			setMyBookingsRefresh((r) => r + 1); // trigger refresh
			handleCloseModal();
		} catch (err) {
			setModalError(err.message || "Failed to cancel booking");
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	if (!currentUserId) return <p>Please log in to book a desk.</p>;

	return (
		<div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
			<div style={{ flex: 2 }}>
				<h1>Office Available Desks</h1>
				<DeskStatusLegend />
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
			<div className="my-bookings-wrapper" style={{ flex: 1 }}>
				<MyBookings refreshTrigger={myBookingsRefresh} />
			</div>
		</div>
	);
};

export default Home;
