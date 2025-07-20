import PropTypes from "prop-types";

import "./UserMenu.css";

function formatUsername(user) {
	return `${user.first_name} ${user.last_name[0]}.`;
}

const UserMenu = ({ user, logout }) => {
	return (
		<>
			<details>
				<summary>{formatUsername(user)}</summary>
				<ul>
					<li>
						<button onClick={logout}>Logout</button>
					</li>
				</ul>
			</details>
		</>
	);
};

export default UserMenu;

UserMenu.propTypes = {
	user: PropTypes.object.isRequired,
	logout: PropTypes.func.isRequired,
};
