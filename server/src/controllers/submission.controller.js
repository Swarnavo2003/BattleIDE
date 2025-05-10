import { db } from "../lib/db.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getAllSubmission = asyncHandler(async (req, res) => {
  const userId = req.id;
  const submission = await db.submission.findMany({
    where: {
      userId: userId,
    },
  });

  if (!submission) {
    throw new ApiError(404, "No submission found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { submission }, "Submissions Fetched Successfully"),
    );
});

export const getSubmissionForProblem = asyncHandler(async (req, res) => {
  const userId = req.id;
  const problemId = req.params.id;

  const submission = await db.submission.findMany({
    where: {
      userId: userId,
      problemId: problemId,
    },
  });

  if (!submission) {
    throw new ApiError(404, "No submission found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { submission }, "Submissions Fetched Successfully"),
    );
});

export const getAllTheSubmissionsForProblem = asyncHandler(async (req, res) => {
  const problemId = req.params.id;
  const submission = await db.submission.findMany({
    where: {
      problemId: problemId,
    },
  });

  if (!submission) {
    throw new ApiError(404, "No submission found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { submission }, "Submissions Fetched Successfully"),
    );
});
