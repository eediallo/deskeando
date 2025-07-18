import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerUser } from "../services/apiService";

import "./Register.css";
const Register = () => {
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			await registerUser(form);
			navigate("/login");
		} catch (err) {
			setError(err.message || "Registration failed");
		}
	};

	return (
		<div className="register-container">
			<h2>Register</h2>
			<form onSubmit={handleSubmit}>
				<input
					name="firstName"
					placeholder="First Name"
					value={form.firstName}
					onChange={handleChange}
					required
				/>
				<input
					name="lastName"
					placeholder="Last Name"
					value={form.lastName}
					onChange={handleChange}
					required
				/>
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
				<button type="submit">Register</button>
			</form>
			{error && <p>{error}</p>}
			<p style={{ marginTop: "1rem" }}>
				Already have an account? <Link to="/login">Login here</Link>
			</p>
		</div>
	);
};

export default Register;
