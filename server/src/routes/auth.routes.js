import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";
import {
  userLoginValidator,
  userRegistrationValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post(
  "/register",
  userRegistrationValidator(),
  validate,
  registerUser,
);

authRouter.post("/login", userLoginValidator(), validate, loginUser);

authRouter.get("/logout", authMiddleware, logoutUser);

authRouter.get("/current-user", authMiddleware, getCurrentUser);

export default authRouter;
