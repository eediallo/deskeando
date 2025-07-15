import jwt from "jsonwebtoken";

import config from "../utils/config.js";

export const authenticate = (req, res, next) => {
	const token = req.cookies?.token;

	if (!token) {
		return res.status(401).json({ error: "Authentication required" });
	}

	try {
		const decoded = jwt.verify(token, config.jwtSecret);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ error: err.message });
	}
};
