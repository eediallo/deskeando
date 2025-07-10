import { users } from "../../fixtures/users.js";

export function getAll() {
	return users;
}

export function registerUser({ firstName, lastName }) {
	const user = {
		id: String(Math.floor(Math.random() * 1000000)),
		firstName,
		lastName,
	};

	users.push(user);
	return user;
}
