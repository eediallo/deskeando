import { Link } from "react-router-dom";

import Logo from "../assets/logo.png";
import { useAppContext } from "../context/useAppContext";
import "../styles/Header.css";

const Header = () => {
	const { isAuthenticated } = useAppContext();
	return (
		<header className="app-header">
			<div>
				<a href="/">
					<img className="logo" src={Logo} alt="logo" />
				</a>
			</div>
			<nav>
				{!isAuthenticated && (
					<>
						<Link className="login-btn" to="/login">
							Login
						</Link>
						<Link className="register-btn" to="/register">
							Sign Up
						</Link>
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
