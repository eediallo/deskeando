import { useEffect, useState } from "react";

import { useAppContext } from "../context/useAppContext";
import { getBookingsFiltered } from "../services/apiService";
import "./CalendarView.css";

const CalendarView = () => {
	const { desks, users, bookingChangeCounter } = useAppContext();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	// const [refreshFlag, setRefreshFlag] = useState(0);

	const getWeekDays = () => {
		const weekDays = [];
		const day = new Date(currentDate);
		const dayOfWeek = day.getDay();
		const startDate = new Date(day.setDate(day.getDate() - dayOfWeek));

		for (let i = 0; i < 7; i++) {
			const weekDay = new Date(startDate);
			weekDay.setDate(startDate.getDate() + i);
			weekDays.push(weekDay);
		}
		return weekDays;
	};

	const weekDays = getWeekDays();

	useEffect(() => {
		const from = weekDays[0].toISOString().split("T")[0];
		const to = weekDays[6].toISOString().split("T")[0];
		setLoading(true);
		getBookingsFiltered({ from, to })
			.then((data) => {
				setBookings(data);
				setError(null);
			})
			.catch((err) => setError(err))
			.finally(() => setLoading(false));
	}, [currentDate, bookingChangeCounter]);

	const findBooking = (deskId, date) => {
		return bookings.find((booking) => {
			const bookingDate = new Date(booking.from_date);
			return (
				booking.desk_id === deskId &&
				bookingDate.toDateString() === date.toDateString()
			);
		});
	};

	const findUser = (userId) => {
		return users.find((user) => user.id === userId);
	};

	const handlePrevWeek = () => {
		const newDate = new Date(currentDate);
		newDate.setDate(currentDate.getDate() - 7);
		setCurrentDate(newDate);
	};

	const handleNextWeek = () => {
		const newDate = new Date(currentDate);
		newDate.setDate(currentDate.getDate() + 7);
		setCurrentDate(newDate);
	};

	// const refreshBookings = () => {
	// 	setRefreshFlag((prev) => prev + 1);
	// };

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<div className="calendar-view">
			<div className="calendar-header">
				<button onClick={handlePrevWeek}>&lt; Prev Week</button>
				<h2>Week of {weekDays[0].toLocaleDateString()}</h2>
				<button onClick={handleNextWeek}>Next Week &gt;</button>
			</div>
			<table className="calendar-table">
				<thead>
					<tr>
						<th>Desk</th>
						{weekDays.map((day) => (
							<th key={day.toISOString()}>{day.toLocaleDateString()}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{desks.map((desk) => (
						<tr key={desk.id}>
							<td>{desk.name}</td>
							{weekDays.map((day) => {
								const booking = findBooking(desk.id, day);
								const user = booking ? findUser(booking.user_id) : null;
								return (
									<td
										key={day.toISOString()}
										className={booking ? "booked" : ""}
									>
										{user ? `${user.firstName} ${user.lastName}` : ""}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default CalendarView;
