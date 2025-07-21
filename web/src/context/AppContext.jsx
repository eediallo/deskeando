import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";

import {
	getUsers,
	getDesks,
	getBookings,
	getCurrentUser,
	logoutUser,
} from "../services/apiService";

const AppContext = createContext();
export { AppContext };

export const AppProvider = ({ children }) => {
	const [users, setUsers] = useState([]);
	const [desks, setDesks] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);

	// Restore session and current user on mount
	useEffect(() => {
		const restoreSession = async () => {
			setLoading(true);
			try {
				const user = await getCurrentUser();
				setCurrentUser(user);
				setIsAuthenticated(true);
			} catch {
				setCurrentUser(null);
				setIsAuthenticated(false);
			} finally {
				setLoading(false);
			}
		};
		restoreSession();
	}, []);
	// Logout function: clears state and calls backend
	const logout = async () => {
		try {
			await logoutUser();
		} catch {
			// Ignore errors, always clear state
		}
		setIsAuthenticated(false);
		setCurrentUser(null);
		setUsers([]);
		setDesks([]);
		setBookings([]);
	};

	useEffect(() => {
		if (!isAuthenticated) {
			setUsers([]);
			setDesks([]);
			setBookings([]);
			setCurrentUser(null);
			return;
		}
		const fetchData = async () => {
			setLoading(true);
			try {
				const [usersData, desksData, bookingsData] = await Promise.all([
					getUsers(),
					getDesks(),
					getBookings(),
				]);
				const mappedUsers = usersData.map((u) => ({
					...u,
					firstName: u.first_name,
					lastName: u.last_name,
				}));
				setUsers(mappedUsers);
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
	}, [isAuthenticated, currentUser]);

	return (
		<AppContext.Provider
			value={{
				users,
				desks,
				bookings,
				loading,
				error,
				setBookings,
				isAuthenticated,
				setIsAuthenticated,
				currentUser,
				setCurrentUser,
				logout,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

AppProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
