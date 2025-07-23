import { useState } from "react";

import UserMenu from "../components/UserMenu";
import { useAppContext } from "../context/useAppContext";

import CalendarView from "./CalendarView";
import Home from "./Home";
import "./Dashboard.css";

const Dashboard = () => {
	const { currentUser, logout } = useAppContext();
	const [tab, setTab] = useState("desks");

	return (
		<div className="dashboard">
			<aside className="dashboard-sidebar">
				<div>
					<button onClick={() => setTab("desks")}>Desks View</button>
					<button onClick={() => setTab("calendar")}>Calendar View</button>
				</div>
				<UserMenu
					user={currentUser}
					logout={async () => {
						await logout();
						window.location.href = "/login";
					}}
				/>
			</aside>
			<main className="dashboard-main">
				{tab === "desks" && <Home />}
				{tab === "calendar" && <CalendarView />}
			</main>
		</div>
	);
};

export default Dashboard;
