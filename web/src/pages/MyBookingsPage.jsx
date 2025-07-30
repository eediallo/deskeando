import PropTypes from "prop-types";

import MyBookings from "../components/MyBookings";

const MyBookingsPage = ({ myBookings, refreshBookings }) => {
	return (
		<div className="card">
			<h2>My Bookings</h2>
			<p>
				Here you can find an overview of your upcoming and past desk
				reservations.
			</p>
			<hr />
			<MyBookings myBookings={myBookings} refreshBookings={refreshBookings} />
		</div>
	);
};

MyBookingsPage.propTypes = {
	myBookings: PropTypes.object.isRequired,
	refreshBookings: PropTypes.func.isRequired,
};

export default MyBookingsPage;
