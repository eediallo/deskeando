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
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="dashboard">
			<div
				className="menu-icon"
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						setIsSidebarOpen(!isSidebarOpen);
					}
				}}
				role="button"
				tabIndex="0"
			>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<nav className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
				<div className="sidebar-user">
					<div className="sidebar-user-info">
						<span className="sidebar-user-email">{currentUser?.email}</span>
					</div>
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

				<div className="sidebar-nav">
					<button
						className={activeTab === "dashboard" ? "active" : ""}
						onClick={() => {
							setActiveTab("dashboard");
							setIsSidebarOpen(false);
						}}
					>
						Desk View
					</button>
					<button
						className={activeTab === "calendar" ? "active" : ""}
						onClick={() => {
							setActiveTab("calendar");
							setIsSidebarOpen(false);
						}}
					>
						Calendar View
					</button>
					<button
						className={activeTab === "bookings" ? "active" : ""}
						onClick={() => {
							setActiveTab("bookings");
							setIsSidebarOpen(false);
						}}
					>
						My Bookings
					</button>
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
