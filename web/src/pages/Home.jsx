import { useEffect, useState } from "react";

import BookingModal from "../components/BookingModal";
import DeskGrid from "../components/DeskGrid";
import MyBookings from "../components/MyBookings";
import { useAppContext } from "../context/useAppContext";
import {
	createBooking,
	deleteBooking,
	getBookingsFiltered,
	getMyBookings,
} from "../services/apiService";

const Home = () => {
	const { desks, users, loading, error } = useAppContext();
	const [bookings, setBookings] = useState([]);
	const [selectedDesk, setSelectedDesk] = useState(null);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalError, setModalError] = useState("");
	const [myBookings, setMyBookings] = useState([]);
	// Use the logged-in user from context
	const { currentUser } = useAppContext();
	const currentUserId = currentUser ? String(currentUser.id) : null;

	// Debug log
	console.log("bookings:", bookings, "currentUserId:", currentUserId);

	useEffect(() => {
		if (!currentUserId) return;
		const today = new Date().toISOString().split("T")[0];
		// Fetch visible desk bookings
		getBookingsFiltered({ from: today, to: today })
			.then(setBookings)
			.catch((err) => alert(err.message || "Failed to fetch bookings"));

		// Fetch user's personal bookings
		getMyBookings()
			.then((data) => {
				setMyBookings(Array.isArray(data.upcoming) ? data.upcoming : []);
			})
			.catch(() => {});

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
			setMyBookings([...myBookings, newBooking]);
			handleCloseModal();
		} catch (err) {
			setModalError(err.message || "Failed to book desk");
		}
	};

	const handleCancel = async (bookingId) => {
		try {
			await deleteBooking(bookingId);
			setBookings(bookings.filter((b) => b.booking_id !== bookingId));
			setMyBookings(myBookings.filter((b) => b.booking_id !== bookingId));
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
						myBookings={myBookings}
					/>
				)}
			</div>
			<div className="my-bookings-wrapper" style={{ flex: 1 }}>
				<MyBookings myBookings={myBookings} />
			</div>
		</div>
	);
};

export default Home;
