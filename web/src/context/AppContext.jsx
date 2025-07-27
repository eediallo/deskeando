import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";

import {
	getUsers,
	getDesks,
	getCurrentUser,
	logoutUser,
} from "../services/apiService";

const AppContext = createContext();
export { AppContext };

export const AppProvider = ({ children }) => {
	const [users, setUsers] = useState([]);
	const [desks, setDesks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [bookingChangeCounter, setBookingChangeCounter] = useState(0);

	// Called to notify other views about booking changes
	const notifyBookingChange = () => setBookingChangeCounter((prev) => prev + 1);

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
	};

	useEffect(() => {
		if (!isAuthenticated) {
			setUsers([]);
			setDesks([]);
			setCurrentUser(null);
			return;
		}
		const fetchData = async () => {
			setLoading(true);
			try {
				const [usersData, desksData] = await Promise.all([
					getUsers(),
					getDesks(),
				]);
				const mappedUsers = usersData.map((u) => ({
					...u,
					firstName: u.first_name,
					lastName: u.last_name,
				}));
				setUsers(mappedUsers);
				setDesks(desksData);
				// If currentUser is not set, try to find by email from localStorage (if available)
				if (!currentUser) {
					const storedEmail = localStorage.getItem("loggedInEmail");
					if (storedEmail) {
						const found = mappedUsers.find((u) => u.email === storedEmail);
						if (found) setCurrentUser(found);
					}
				}
				setError(null);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [isAuthenticated, currentUser]);

	return (
		<AppContext.Provider
			value={{
				users,
				desks,
				loading,
				error,
				isAuthenticated,
				setIsAuthenticated,
				currentUser,
				setCurrentUser,
				logout,
				bookingChangeCounter,
				notifyBookingChange,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

AppProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
