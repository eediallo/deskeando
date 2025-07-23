import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Hero from "./assets/hero.jpg";
import Header from "./components/Header";
import "./App.css";
import { useAppContext } from "./context/useAppContext";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function App() {
	const { isAuthenticated } = useAppContext();
	const location = useLocation();
	const isDashboard = location.pathname === "/dashboard";
	return (
		<div>
			{!isDashboard && <Header />}
			<Routes>
				<Route
					path="/"
					element={
						<div className="hero">
							<div className="hero-description">
								<h1>Book a Desk</h1>
								<p>Reserve your workspace in advance.</p>
								<Link to="/login" className="book-now-btn">
									Book Now
								</Link>
							</div>
							<div>
								<img className="hero-image" src={Hero} alt="desk booking" />
							</div>
						</div>
					}
				/>
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute isAuthenticated={isAuthenticated}>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</div>
	);
}

function ProtectedRoute({ isAuthenticated, children }) {
	const { loading } = useAppContext();
	if (loading) return null;
	if (isAuthenticated) return children;
	return <Navigate to="/login" replace />;
}
ProtectedRoute.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	children: PropTypes.node.isRequired,
};

export default App;
