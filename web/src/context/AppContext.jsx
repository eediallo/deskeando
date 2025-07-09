import PropTypes from "prop-types";
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from "react";

// Using mock data
import { mockUsers, mockDesks, mockBookings } from "../services/mockData.js";

// API call temporarily commented out
// import { getUsers, getDesks, getBookings } from "../services/apiService";

const AppContext = createContext();

export { AppContext };

export const AppProvider = ({ children }) => {
	// Using mock data for state initialization
	const [users, setUsers] = useState(mockUsers);
	const [desks, setDesks] = useState(mockDesks);
	const [bookings, setBookings] = useState(mockBookings);
	const [loading, setLoading] = useState(false); // Set to false as we are using mock data
	const [error, setError] = useState(null);

	// The useEffect for fetching data and polling is commented out for now.
	// When the API is ready, this section can be uncommented and the mock data
	// initialization above can be replaced with empty arrays.
	/*
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [usersData, desksData, bookingsData] = await Promise.all([
					getUsers(),
					getDesks(),
					getBookings(),
				]);
				setUsers(usersData);
				setDesks(desksData);
				setBookings(bookingsData);
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();

		// Live updates polling
		const intervalId = setInterval(() => {
			getBookings().then(setBookings).catch(setError);
		}, 5000); // Poll every 5 seconds

		return () => clearInterval(intervalId);
	}, []);
	*/

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
