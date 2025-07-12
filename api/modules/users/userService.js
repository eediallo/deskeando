import { registerUser, getAll } from "./userRepository.js";

export async function handleRegisterUser({ firstName, lastName }) {
	return await registerUser({ firstName, lastName });
}

export async function getUsers() {
	return await getAll();
}
