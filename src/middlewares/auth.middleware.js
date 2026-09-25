import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  // console.log("🔥 VERIFY JWT STARTED");
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized request, Token not found!!");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE);

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    }

    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid access token");
    }

    throw new ApiError(401, "Authentication failed");
  }

  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken",
  );
  
  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = user;

  next();
});

export { verifyJWT };
