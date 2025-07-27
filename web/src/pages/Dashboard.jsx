import { useState } from "react";

import UserMenu from "../components/UserMenu";
import { useAppContext } from "../context/useAppContext";

import CalendarView from "./CalendarView";
import Home from "./Home";
import MyBookingsPage from "./MyBookingsPage";
import "./Dashboard.css";

const Dashboard = () => {
	const { currentUser, logout } = useAppContext();
	const [activeTab, setActiveTab] = useState("dashboard");

	return (
		<div className="dashboard">
			<nav className="dashboard-sidebar">
				<div className="sidebar-user">
					<div className="sidebar-user-info">
						<span className="sidebar-user-email">{currentUser?.email}</span>
					</div>
				</div>
				<div className="sidebar-nav">
					<button
						className={activeTab === "dashboard" ? "active" : ""}
						onClick={() => setActiveTab("dashboard")}
					>
						Dashboard
					</button>
					<button
						className={activeTab === "calendar" ? "active" : ""}
						onClick={() => setActiveTab("calendar")}
					>
						Calendar View
					</button>
					<button
						className={activeTab === "bookings" ? "active" : ""}
						onClick={() => setActiveTab("bookings")}
					>
						My Bookings
					</button>
				</div>
				<div className="sidebar-bottom">
					<UserMenu
						user={currentUser}
						logout={async () => {
							await logout();
							window.location.href = "/login";
						}}
					/>
				</div>
			</nav>
			<main className="dashboard-main">
				{activeTab === "dashboard" && <Home />}
				{activeTab === "calendar" && <CalendarView />}
				{activeTab === "bookings" && <MyBookingsPage />}
			</main>
		</div>
	);
};

export default Dashboard;
