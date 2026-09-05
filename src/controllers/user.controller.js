import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"

//create controller for user register
const registerUser = asyncHandler(async (req, res) => {
  //alogirthm
  //get information from the frontend
  //validation middleware
  //user already exists or not
  //check avatar
  //upload on cloudinary
  //create user object
  //remove password and refreshtoken from res
  //return res

  // 1. Get information from frontend
  console.log("controller started..");
  console.log("REQ BODY:", req.body);

  const { email, username, password, fullName } = req.body;

  // 2. Check if user already exists
  console.log("2 body received");
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exist!!");
  }

  // 3. Get avatar local path
  console.log("3 user checked");
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar image required");
  }

  // 4. Upload avatar to Cloudinary
  console.log("4 avatar path:", avatarLocalPath);
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "upload failed!!");
  }

  // 5. Create user
  console.log("user created");

  const newUser = await User.create({
    username,
    fullName,
    email,
    password,
    avatar: avatar.url,
  });

  // 6. Get created user without sensitive fields
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken",
  );
  if (!createdUser) {
    throw new ApiError(500, "user creation failed!!");
  }

  //Return response

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "user registered successfully..."));
});

const loginUser = asyncHandler(async (req, res) => {
  //get info =>username and password
  //check email and password are correct => password check with bcrypt.compare
  //access and refresh token generate
  //send cookies
  //refresh token saved in db
  //send res

  const { username, password } = req.body;

  const user = await User.findOne({
    $or: [{ username }],
  });
  if (!user) {
    throw new ApiError(404, "user does not exists!!");
  }

  const passwordValid = await user.isPasswordCorrect(password);
  if (!passwordValid) {
    throw new ApiError(401, "invalid user cradentials");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  console.log("Access and Refresh token generated successfully");

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  console.log("Refresh token saved in DB!!");

  const options = {
    httpOnly: true,
    secure: false,
  };
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(201, "user login successfully."));
});

//logout controller
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", "", options)
    .clearCookie("refreshToken", "", options)
    .json(new ApiResponse(200, {}, "user logout successfully"));
});

//get user profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  return res.json(
    new ApiResponse(200, req.user, "user profile fetched successfully.."),
  );
});

//change password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const validPaswword = await user.isPasswordCorrect(oldPassword);
  if (!validPaswword) {
    throw new ApiError(400, "invalid old password");
  }
  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "change password successfuly"));
});

//update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { username, email, fullName } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        email,
        username,
        fullName,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "user not found!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "profile updated successfully.."));
});

//refresh access token
const refreshAccessToken= asyncHandler(async(req,res)=>{
  const incomingRefreshToken= req.cookies?.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "refresh token required!!")
  }
  const decodedToken= jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRETE
  )
  const user=await User.findById(decodedToken?._id)
   if (!user) {
    throw new ApiError(401, "Invalid refresh token");
    }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(404, "Refresh token is expired or invalid")
  }
  const newAccessToken=user.generateAccessToken()

  const options={
    httpOnly:true,
    secure: true
  }

  return res
  .status(200)
  .cookie("accessToken", newAccessToken, options)
  .json(new ApiResponse(200,{}, "access token refreshed successfully" ))

})

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUserProfile,
  changePassword,
  updateUserProfile,
  refreshAccessToken
};
