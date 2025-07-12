import { Route, Routes } from "react-router";

import "./App.css";
import Header from "./components/Header";
import About from "./pages/About.jsx";
import CalendarView from "./pages/CalendarView.jsx";
import Home from "./pages/Home.jsx";

function App() {
	return (
		<div>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/calendar" element={<CalendarView />} />
				<Route path="/nested/about/path" element={<About />} />
			</Routes>
		</div>
	);
}

export default App;
