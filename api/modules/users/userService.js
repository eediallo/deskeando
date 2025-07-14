import { registerUser, getAll } from "./userRepository.js";

export async function handleRegisterUser({
	firstName,
	lastName,
	email,
	password,
}) {
	return await registerUser({ firstName, lastName, email, password });
}

export async function getUsers() {
	return await getAll();
}
