import { asyncHandler } from "../utils/asyncHandler.js";
import { Activity } from "../models/activity.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getRecentActivity= asyncHandler(async(req,res)=>{
    const activities= await Activity.find({
      user: req.user._id
    })
    .populate("task", "title status priority")
    .sort({createdAt: -1})
    .limit(10)

    return res.status(200).json(
    new ApiResponse(
      200,
      activities,
      "Recent activities fetched successfully"
    )
  );
  })

  export {getRecentActivity}