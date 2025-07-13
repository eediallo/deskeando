import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";

import { getUsers, getDesks, getBookings } from "../services/apiService";

const AppContext = createContext();
export { AppContext };

export const AppProvider = ({ children }) => {
	const [users, setUsers] = useState([]);
	const [desks, setDesks] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const [usersData, desksData, bookingsData] = await Promise.all([
					getUsers(),
					getDesks(),
					getBookings(),
				]);
				setUsers(
					usersData.map((u) => ({
						...u,
						firstName: u.first_name,
						lastName: u.last_name,
					})),
				);
				setDesks(desksData);
				setBookings(bookingsData);
				setError(null);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();

		const intervalId = setInterval(() => {
			getBookings().then(setBookings).catch(setError);
		}, 5000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<AppContext.Provider
			value={{ users, desks, bookings, loading, error, setBookings }}
		>
			{children}
		</AppContext.Provider>
	);
};

AppProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
