import { UserRole } from "../generated/prisma/index.js";
import { db } from "../lib/db.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new ApiError(404, "You are logged out");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(404, "Unauthorized - Invalid Token");
  }

  const user = await db.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  req.id = user.id;
  next();
});

export const checkAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.id;

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== UserRole.ADMIN) {
    throw new ApiError(403, "Forbidden - Admins only");
  }

  next();
});
