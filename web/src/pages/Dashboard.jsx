import { useState } from "react";

import { useAppContext } from "../context/useAppContext";

import CalendarView from "./CalendarView";
import Home from "./Home";

const Dashboard = () => {
	const { setIsAuthenticated } = useAppContext();
	const [tab, setTab] = useState("desks");

	const handleLogout = () => {
		setIsAuthenticated(false);
		// Optionally, clear cookies/localStorage here
		window.location.href = "/login";
	};

	return (
		<div className="dashboard">
			<aside className="dashboard-sidebar">
				<button onClick={() => setTab("desks")}>Desks View</button>
				<button onClick={() => setTab("calendar")}>Calendar View</button>
				<button onClick={handleLogout}>Logout</button>
			</aside>
			<main className="dashboard-main">
				{tab === "desks" && <Home />}
				{tab === "calendar" && <CalendarView />}
			</main>
		</div>
	);
};

export default Dashboard;
