import { useState } from "react";

import UserMenu from "../components/UserMenu";
import { useAppContext } from "../context/useAppContext";

import CalendarView from "./CalendarView";
import Home from "./Home";
import "./Dashboard.css";

const Dashboard = () => {
	const { setIsAuthenticated, currentUser } = useAppContext();
	const [tab, setTab] = useState("desks");

	const handleLogout = () => {
		setIsAuthenticated(false);
		// Optionally, clear cookies/localStorage here
		window.location.href = "/login";
	};

	return (
		<div className="dashboard">
			<aside className="dashboard-sidebar">
				<div>
					<button onClick={() => setTab("desks")}>Desks View</button>
					<button onClick={() => setTab("calendar")}>Calendar View</button>
				</div>
				<UserMenu user={currentUser} logout={handleLogout} />
			</aside>
			<main className="dashboard-main">
				{tab === "desks" && <Home />}
				{tab === "calendar" && <CalendarView />}
			</main>
		</div>
	);
};

export default Dashboard;
