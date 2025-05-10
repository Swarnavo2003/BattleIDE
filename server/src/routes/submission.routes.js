import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getAllSubmission,
  getAllTheSubmissionsForProblem,
  getSubmissionForProblem,
} from "../controllers/submission.controller.js";

const submissionRouter = Router();

submissionRouter.get("/get-all-submission", authMiddleware, getAllSubmission);
submissionRouter.get(
  "/get-submission/:id",
  authMiddleware,
  getSubmissionForProblem,
);
submissionRouter.get(
  "/get-submission-count/:id",
  authMiddleware,
  getAllTheSubmissionsForProblem,
);

export default submissionRouter;
