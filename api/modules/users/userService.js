import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { ApiError } from "../../errors/ApiError.js";
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
		throw new ApiError("Invalid credentials", StatusCodes.UNAUTHORIZED);
	}

	const passwordMatch = await bcryptjs.compare(password, user.password);

	if (!passwordMatch) {
		throw new ApiError("Invalid credentials", StatusCodes.UNAUTHORIZED);
	}

	if (!config.jwtSecret) {
		throw new ApiError("Missing JWT_SECRET", StatusCodes.INTERNAL_SERVER_ERROR);
	}

	const token = jwt.sign(
		{
			id: user.id,
			email: user.email,
			firstName: user.first_name,
			lastName: user.last_name,
		},
		config.jwtSecret,
		{
			expiresIn: "1h",
		},
	);

	return { token };
}
