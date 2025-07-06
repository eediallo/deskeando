import { users } from "../../fixtures/users.js";

export function registerUser({ firstName, lastName }) {
	const user = {
		id: Math.floor(Math.random() * 1000000),
		firstName: firstName,
		lastName: lastName,
	};

	users.push(user);
	return user;
}
