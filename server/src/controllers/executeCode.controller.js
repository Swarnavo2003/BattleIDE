import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../lib/judge0.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { db } from "../lib/db.js";

export const executeCode = asyncHandler(async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;

  const userId = req.id;

  if (!source_code || !language_id || !problemId) {
    throw new ApiError(400, "Missing required fields");
  }

  if (!Number.isInteger(language_id)) {
    throw new ApiError(400, "Invalid language_id");
  }

  const validLanguageIds = [71, 62, 63]; // Python, Java, JavaScript
  if (!validLanguageIds.includes(language_id)) {
    throw new ApiError(400, "Unsupported programming language");
  }

  // console.log("Body", req.body);
  // console.log("-----------------------------");

  // 1. Validate test cases
  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
  ) {
    throw new ApiError(400, "Invalid or Missing test cases");
  }

  // 2. Prepare each test case for judge0 batch submission
  const submissions = stdin.map((input) => ({
    source_code,
    language_id,
    stdin: input,
  }));
  // console.log("Submission", submission);
  // console.log("-----------------------------");

  // 3. Send this batch of submission to judge0
  const submitResponse = await submitBatch(submissions);
  // console.log("Submission Results", submitResponse);
  // console.log("-----------------------------");

  const tokens = submitResponse.map((res) => res.token);
  // console.log("Tokens", tokens);
  // console.log("-----------------------------");

  // 4. Poll judge0 for all the submitted test cases
  const results = await pollBatchResults(tokens);

  // console.log("Results", results);
  // console.log("-----------------------------");

  // 5. Analyse test cases result
  let allPassed = true;

  const detailedResult = results.map((result, i) => {
    const stdout = result.stdout?.trim();
    const expected_output = expected_outputs[i].trim();

    const passed = stdout === expected_output;

    if (!passed) allPassed = false;

    // console.log(`Test case ${i + 1}`);
    // console.log(`Input ${stdin[i]}`);
    // console.log(`Expected Output ${expected_output}`);
    // console.log(`Actual Output ${stdout}`);
    // console.log(`Matched ${passed}`);
    // console.log("-----------------------------");

    return {
      testCase: i + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr || null,
      compile_output: result.compile_output || null,
      status: result.status.description || null,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined,
    };
  });

  // console.log("Detailed Result", detailedResult);
  // console.log("-----------------------------");

  // 6. store submission summary
  const submission = await db.submission.create({
    data: {
      userId,
      problemId,
      sourceCode: source_code,
      language: getLanguageName(language_id),
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(detailedResult.map((r) => r.stdout)),
      stderr: detailedResult.some((r) => r.stderr)
        ? JSON.stringify(detailedResult.map((r) => r.stderr))
        : null,
      compileOutput: detailedResult.some((r) => r.compile_output)
        ? JSON.stringify(detailedResult.map((r) => r.compile_output))
        : null,
      status: allPassed ? "Accepted" : "Wrong Answer",
      memory: detailedResult.some((r) => r.memory)
        ? JSON.stringify(detailedResult.map((r) => r.memory))
        : null,
      time: detailedResult.some((r) => r.time)
        ? JSON.stringify(detailedResult.map((r) => r.time))
        : null,
    },
  });

  // console.log(submission);
  // console.log("-----------------------------");

  // 7. If all passed true - mark problem as solved for the currect user
  if (allPassed) {
    await db.problemSolved.upsert({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
      },
      update: {},
      create: {
        userId,
        problemId,
      },
    });
  }

  // 8. save indivitual test case results using detailedResult
  const testCaseResults = detailedResult.map((result) => ({
    submissionId: submission.id,
    testCase: result.testCase,
    passed: result.passed,
    stdout: result.stdout,
    expected: result.expected,
    stderr: result.stderr ? result.stderr : null,
    compileOutput: result.compile_output ? result.compile_output : null,
    status: result.status,
    memory: result.memory,
    time: result.time,
  }));

  await db.testCaseResult.createMany({
    data: testCaseResults,
  });

  const submissionWithTestCase = await db.submission.findUnique({
    where: {
      id: submission.id,
    },
    include: {
      testCases: true,
    },
  });

  // console.log(submissionWithTestCase);
  // console.log("-----------------------------");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { submission: submissionWithTestCase },
        "Code Executed",
      ),
    );
});
