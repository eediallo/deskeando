import { useState } from "react";

import { useAppContext } from "../context/useAppContext";
import "./MyBookings.css";

const MyBookings = () => {
	const { bookings, currentUser, loading, error } = useAppContext();
	const [tab, setTab] = useState("upcoming");

	function toDateString(date) {
		const d = new Date(date);
		return d.toISOString().split("T")[0];
	}
	const todayStr = toDateString(new Date());

	const myBookings = bookings.filter(
		(b) => currentUser && b.user_id === currentUser.id,
	);
	const upcomingBookings = myBookings.filter(
		(b) => toDateString(b.from_date) >= todayStr,
	);
	const pastBookings = myBookings.filter(
		(b) => toDateString(b.from_date) < todayStr,
	);
	const displayedBookings =
		tab === "upcoming" ? upcomingBookings : pastBookings;

	return (
		<div className="my-bookings-container">
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
			<h2>My Bookings</h2>
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
							Date: {new Date(booking.from_date).toLocaleDateString()} <br />
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default MyBookings;
