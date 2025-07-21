import { Router } from "express";

import { authenticate } from "../../middlewares/authMiddleware.js";

const meRouter = Router();

meRouter.get("/", authenticate, (req, res) => {
	res.json(req.user); // req.user is set by authMiddleware
});

export default meRouter;
