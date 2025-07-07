import { registerUser, getAll } from "./userRepository.js";

export function handleRegisterUser({ firstName, lastName }) {
	return registerUser({ firstName, lastName });
}

export function getUsers() {
	return getAll();
}
