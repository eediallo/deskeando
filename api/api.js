import { Router } from "express";

// import messageRouter from "./messages/messageRouter.js";

import bookingRouter from "./modules/bookings/bookingRouter.js";
import deskRouter from "./modules/desks/deskRouter.js";
import userRouter from "./modules/users/userRouter.js";

const api = Router();

// api.use("/message", messageRouter);

api.use("/v1/desks", deskRouter);

api.use("/v1/bookings", bookingRouter);

api.use("/v1/users", userRouter);

export default api;
