import { createUser } from "./userRepository.js";

export function handleCreateUser({ firstName, lastName }) {
	return createUser({ firstName, lastName });
}
