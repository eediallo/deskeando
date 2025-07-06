import { Router } from "express";

// import messageRouter from "./messages/messageRouter.js";

import deskRouter from "./modules/desks/deskRouter.js";

const api = Router();

// api.use("/message", messageRouter);

api.use("/v1/desks", deskRouter);

export default api;
