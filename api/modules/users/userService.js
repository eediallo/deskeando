import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import config from "../../utils/config.js";

import { registerUser, getAll, findUserByEmail } from "./userRepository.js";

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

export async function handleLogin({ email, password }) {
	const user = await findUserByEmail(email);

	if (!user) {
		throw new Error("Invalid credentials");
	}

	const passwordMatch = await bcrypt.compare(password, user.password);

	if (!passwordMatch) {
		throw new Error("Invalid credentials");
	}

	if (!config.jwtSecret) {
		throw new Error("Missing JWT_SECRET");
	}

	const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
		expiresIn: "1h",
	});

	return { token };
}
