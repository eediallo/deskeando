import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "../context/useAppContext";
import { loginUser, getUsers } from "../services/apiService";

const Login = () => {
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { setIsAuthenticated, setCurrentUser } = useAppContext();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			await loginUser(form);
			// Store email in localStorage for session restoration
			localStorage.setItem("loggedInEmail", form.email);
			setIsAuthenticated(true);
			// Fetch users and set the current user
			const users = await getUsers();
			const found = users.find((u) => u.email === form.email);
			if (found)
				setCurrentUser({
					...found,
					firstName: found.first_name,
					lastName: found.last_name,
				});
			navigate("/");
		} catch (err) {
			setError(err.message || "Login failed");
		}
	};

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<input
					name="email"
					type="email"
					placeholder="Email"
					value={form.email}
					onChange={handleChange}
					required
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					value={form.password}
					onChange={handleChange}
					required
				/>
				<button type="submit">Login</button>
			</form>
			{error && <p style={{ color: "red" }}>{error}</p>}
		</div>
	);
};

export default Login;
