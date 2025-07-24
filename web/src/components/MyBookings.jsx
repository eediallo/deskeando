import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { getMyBookings } from "../services/apiService";
import "./MyBookings.css";

const MyBookings = ({ refreshTrigger }) => {
	const [upcoming, setUpcoming] = useState([]);
	const [past, setPast] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [tab, setTab] = useState("upcoming");

	// function toDateString(date) {
	// 	const d = new Date(date);
	// 	return d.toISOString().split("T")[0];
	// }
	// const todayStr = toDateString(new Date());

	useEffect(() => {
		setLoading(true);
		getMyBookings()
			.then((data) => {
				setUpcoming(Array.isArray(data.upcoming) ? data.upcoming : []);
				setPast(Array.isArray(data.past) ? data.past : []);
				setError(null);
			})
			.catch((err) => setError(err))
			.finally(() => setLoading(false));
	}, [refreshTrigger]);

	// Split into upcoming and past based on today's date
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

MyBookings.propTypes = {
	refreshTrigger: PropTypes.number,
};

export default MyBookings;
