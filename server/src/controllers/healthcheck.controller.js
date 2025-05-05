import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const healthCheck = asyncHandler((req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { message: "Server is running" },
        "HealthCheck Successful",
      ),
    );
});
