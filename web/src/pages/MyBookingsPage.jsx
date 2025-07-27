import MyBookings from "../components/MyBookings";

const MyBookingsPage = () => {
	return (
		<div className="card">
			<h2>My Bookings</h2>
			<p>
				Here you can find an overview of your upcoming and past desk
				reservations.
			</p>
			<hr />
			<MyBookings />
		</div>
	);
};

export default MyBookingsPage;
