import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";

import { getUsers, getDesks } from "../services/apiService";

const AppContext = createContext();
export { AppContext };

export const AppProvider = ({ children }) => {
	const [users, setUsers] = useState([]);
	const [desks, setDesks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);

	// Check for existing session/cookie on mount (use a lightweight endpoint)
	useEffect(() => {
		const checkSession = async () => {
			setLoading(true);
			try {
				// Use a lightweight endpoint for session check
				const res = await fetch("/api/healthz");
				if (res.ok) {
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
				}
			} catch {
				setIsAuthenticated(false);
			} finally {
				setLoading(false);
			}
		};
		checkSession();
	}, []);

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
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

AppProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
