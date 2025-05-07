import { db } from "../lib/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../lib/judge0.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// If you forget un-comment the console.log() statements and read all the outputs to understand the flow
export const createProblem = asyncHandler(async (req, res) => {
  // going to get all the data from the request body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  // loop through each reference solution for different languages
  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    // console.log(language, solutionCode);
    // console.log("-----------------------------");

    const languageId = getJudge0LanguageId(language);
    // console.log("Language ID", languageId);
    // console.log("-----------------------------");

    if (!language) {
      throw new ApiError(400, `Language ${language} not supported`);
    }

    const submissions = testcases.map(({ input, output }) => ({
      source_code: solutionCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }));
    // console.log("Submissions", submissions);
    // console.log("-----------------------------");

    const submissionResults = await submitBatch(submissions);
    // console.log("Submission Results", submissionResults);
    // console.log("-----------------------------");

    const tokens = submissionResults.map((res) => res.token);
    // console.log("Tokens", tokens);
    // console.log("-----------------------------");

    const results = await pollBatchResults(tokens);
    // console.log("Results", results);
    // console.log("-----------------------------");

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      if (result.status.id !== 3) {
        throw new ApiError(
          400,
          `Tescase ${i + 1} failed for language ${language}`,
        );
      }
    }
  }

  const newProblem = await db.problem.create({
    data: {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolutions,
      userId: req.id,
    },
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { problem: newProblem },
        "Problem Created Successfully",
      ),
    );
});

export const getAllProblems = asyncHandler((req, res) => {});

export const getProblemById = asyncHandler((req, res) => {});

export const updateProblem = asyncHandler((req, res) => {});

export const deleteProblem = asyncHandler((req, res) => {});

export const getSolvedProblems = asyncHandler((req, res) => {});
