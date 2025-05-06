import { body } from "express-validator";

export const userRegistrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .isLength({ max: 20 })
      .withMessage("Password must be at most 20 characters long"),
    body("name").trim().notEmpty().withMessage("Name is required"),
  ];
};

export const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .isLength({ max: 20 })
      .withMessage("Password must be at most 20 characters long"),
  ];
};

export const createProblemValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isString()
      .withMessage("Title must be a string"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .isString()
      .withMessage("Description must be a string")
      .isIn(["EASY", "MEDIUM", "HARD"])
      .withMessage("Difficulty must be EASY, MEDIUM or HARD"),
    body("difficulty")
      .trim()
      .notEmpty()
      .withMessage("Difficulty is required")
      .isString()
      .withMessage("Difficulty must be a string"),
    body("tags")
      .isArray({ min: 1 })
      .withMessage("Tags must be a non-empty array")
      .custom((arr) => arr.every((tag) => typeof tag === "string"))
      .withMessage("Tags must be a string in array"),
    body("examples").isObject().withMessage("Examples must be an object"),
    body("constraints")
      .trim()
      .notEmpty()
      .withMessage("Constraints is required")
      .isString()
      .withMessage("Constraints must be a string"),
    body("testcases")
      .isArray({ min: 1 })
      .withMessage("Testcases must be an array")
      .custom((arr) => arr.every((tc) => tc.input && tc.output))
      .withMessage("Each testcase must have input and output"),
    body("codeSnippets")
      .isObject()
      .withMessage("Code snippets must be an object"),
    body("referenceSolution")
      .isObject()
      .withMessage("Reference solution must be an object"),
  ];
};
