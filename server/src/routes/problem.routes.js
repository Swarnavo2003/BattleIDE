import { Router } from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  getSolvedProblems,
  updateProblem,
} from "../controllers/problem.controller.js";
import { createProblemValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";

const problemRouter = Router();

problemRouter.post(
  "/create-problem",
  authMiddleware,
  checkAdmin,
  createProblemValidator(),
  validate,
  createProblem,
);

problemRouter.get("/get-all-problems", authMiddleware, getAllProblems);

problemRouter.get("/get-problem/:id", authMiddleware, getProblemById);

problemRouter.put("update-problem/:id", authMiddleware, updateProblem);

problemRouter.delete("delete-problem/:id", authMiddleware, deleteProblem);

problemRouter.get("/get-solved-problem", authMiddleware, getSolvedProblems);

export default problemRouter;
