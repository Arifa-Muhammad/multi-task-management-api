import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";


//create controller for user register
const registerUser=asyncHandler(async(req,res)=>{
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

    const {email, username, password, fullName}=req.body

    // 2. Check if user already exists
    console.log("2 body received");
    const existedUser=await User.findOne({
        $or: [{username}, {email}]
    })
    if (existedUser) {
        throw new ApiError(409,"User already exist!!")

    }

    // 3. Get avatar local path
    console.log("3 user checked");
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar image required")
    }

     // 4. Upload avatar to Cloudinary
     console.log("4 avatar path:", avatarLocalPath);
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    if (!avatar) {
        throw new ApiError(500, "upload failed!!")
    }

    // 5. Create user
    console.log("user created");
    
    const newUser=await User.create({
        username,
        fullName,
        email,
        password,
        avatar: avatar.url
    })

    // 6. Get created user without sensitive fields
    const createdUser= await User.findById(newUser._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "user creation failed!!")
    }

    //Return response

    return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "user registered successfully..."))
})

export {registerUser}