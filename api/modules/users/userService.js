import { registerUser, getAll } from "./userRepository.js";

export async function handleRegisterUser({ firstName, lastName }) {
	// need to check if the user already exists
	return await registerUser({ firstName, lastName });
}

export async function getUsers() {
	return await getAll();
}
