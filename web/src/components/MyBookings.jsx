import { useEffect, useState } from "react";

import { getMyBookings } from "../services/apiService";

const MyBookings = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBookings = async () => {
			setLoading(true);
			try {
				const data = await getMyBookings();
				setBookings(data);
				setError(null);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		fetchBookings();
	}, []);

	if (loading) return <div>Loading your bookings...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (!bookings.length) return <div>You have no bookings yet.</div>;

	return (
		<div>
			<h2>My Bookings</h2>
			<ul>
				{bookings.map((booking) => (
					<li key={booking.booking_id}>
						Desk: <strong>{booking.desk_name || booking.desk_id}</strong> <br />
						Date: {new Date(booking.from_date).toLocaleDateString()} <br />
						Time:{" "}
						{new Date(booking.from_date).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}{" "}
						-{" "}
						{new Date(booking.to_date).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</li>
				))}
			</ul>
		</div>
	);
};

export default MyBookings;
