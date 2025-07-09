// Using mock data

export const mockUsers = [
	{ id: 1, firstName: "John", lastName: "Doe" },
	{ id: 2, firstName: "Jane", lastName: "Smith" },
	{ id: 3, firstName: "Peter", lastName: "Jones" },
];

export const mockDesks = Array.from({ length: 50 }, (_, i) => ({
	id: `d${i + 1}`,
	name: `Desk ${i + 1}`,
}));

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");

export const mockBookings = [
	{
		booking_id: 1,
		desk_id: "d3",
		user_id: 2,
		from_date: `${yyyy}-${mm}-${dd}T09:00:00`,
		to_date: `${yyyy}-${mm}-${dd}T17:00:00`,
		user: { firstName: "Jane" },
		desk: { name: "Desk 3" },
	},
	{
		booking_id: 2,
		desk_id: "d10",
		user_id: 3,
		from_date: `${yyyy}-${mm}-${dd}T09:00:00`,
		to_date: `${yyyy}-${mm}-${dd}T17:00:00`,
		user: { firstName: "Peter" },
		desk: { name: "Desk 10" },
	},
];
