import { registerUser } from "./userRepository.js";

export function handleRegisterUser({ firstName, lastName }) {
	return registerUser({ firstName, lastName });
}
