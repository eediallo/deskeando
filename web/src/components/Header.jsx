import { Link } from "react-router-dom";

import { useAppContext } from "../context/useAppContext";
import "./Header.css";

const Header = () => {
	const { isAuthenticated } = useAppContext();
	return (
		<header className="app-header">
			<div className="logo">HaveALook</div>
			<nav>
				{!isAuthenticated && (
					<>
						<Link to="/login">Login</Link>
						<Link to="/register">Sign Up</Link>
					</>
				)}
				{isAuthenticated && (
					<>
						<Link to="/">Home</Link>
						<Link to="/calendar">Calendar</Link>
					</>
				)}
			</nav>
		</header>
	);
};

export default Header;
