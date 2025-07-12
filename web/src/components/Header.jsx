import { Link } from "react-router";
import "./Header.css";

const Header = () => {
	return (
		<header className="app-header">
			<nav>
				<Link to="/">Home</Link>
				<Link to="/calendar">Calendar</Link>
			</nav>
		</header>
	);
};

export default Header;
