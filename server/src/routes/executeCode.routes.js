import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controller.js";

const executeCodeRouter = Router();

executeCodeRouter.post("/", authMiddleware, executeCode);

export default executeCodeRouter;
