import PropTypes from "prop-types";
import { useState } from "react";

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
			{!displayedBookings.length ? (
				<div>You have no {tab} bookings yet.</div>
			) : (
				<ul>
					{displayedBookings.map((booking) => (
						<li key={booking.booking_id}>
							Desk: <strong>{booking.desk_name || booking.desk_id}</strong>
							<br />
							Date: {new Date(booking.from_date).toLocaleDateString()}
							<br />
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

MyBookings.propTypes = {
	myBookings: PropTypes.array,
};

export default MyBookings;
