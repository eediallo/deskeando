import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import { useAppContext } from "./context/useAppContext";
import "./App.css";
// import About from "./pages/About.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function App() {
	const { isAuthenticated } = useAppContext();
	return (
		<div>
			<Header />
			<Routes>
				{isAuthenticated ? (
					<Route path="/" element={<Dashboard />} />
				) : (
					<Route
						path="/"
						element={
							<div style={{ textAlign: "center", marginTop: "2rem" }}>
								<h1>Welcome to CompanyName</h1>
								<p>Please log in or sign up to book a desk.</p>
							</div>
						}
					/>
				)}
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</div>
	);
}

export default App;
