import db from "../lib/db.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createProblem = asyncHandler((req, res) => {
  // going to get all the data from the request body
  // going to checkthe user role once again
  // loop through each reference solution for different languages
});

export const getAllProblems = asyncHandler((req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolution,
  } = req.body;
});

export const getProblemById = asyncHandler((req, res) => {});

export const updateProblem = asyncHandler((req, res) => {});

export const deleteProblem = asyncHandler((req, res) => {});

export const getSolvedProblems = asyncHandler((req, res) => {});
