import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/task.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiErrors.js";

//1. create Task
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "task created successfully!!"));
});

//2. Read all task
const getAllTask = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    owner: req.user._id,
    
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tasks, "task fetched successfully.."));
});

//3. get one task by title
// const getTaskByTitle= asyncHandler(async(req,res)=>{
//   const {title}= req.body

//   const tasks= await Task.findOne({
//     owner: req.user._id,
//     title

//   })
//  if(tasks.length == 0){
//    throw new apiError(401, "task not found")
// }

//   return res
//   .status(201)
//   .json(new ApiResponse(201, tasks, "task fetch successfully"))
// })

//3. get task by id
const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findOne({
    _id: taskId,
    owner: req.user._id,
    isDeleted:false
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, task, "task fetched by id successfully"));
});
//4. update task
const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, priority, status, dueDate } = req.body;
  const task = await Task.findOneAndUpdate(
    {
      owner: req.user._id,
      _id: taskId,
    },
    {
      $set: {
        title,
        description,
        priority,
        dueDate,
        status,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!task) {
    throw new ApiError(404, "task not found");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, task, "task updated successfully"));
});

//5. delete task
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findOneAndDelete({
    owner: req.user._id,
    _id: taskId,
  });

  if (!task) {
    throw new ApiError(401, "task not found ");
  }

  return res
    .status(202)
    .json(new ApiResponse(201, task, "task deleted successfully.."));
});

//search
const searchTask = asyncHandler(async (req, res) => {
  const {
    title,
    status,
    priority,
    page = 1,
    limit = 10,
    sort = "newest",
  } = req.query;
  const filter = {
    owner: req.user._id,
    
  };

  //search by title
  if (title) {
    filter.title = {
      $regex: title,
      $options: "i",
    };
  }

  //filter by status
  if (status) {
    filter.status = status;
  }

  //filter by priority
  if (priority) {
    filter.priority = priority;
  }

  //filter by pagination
  const skip = (page - 1) * limit;

  //filter by sort
  let sortOption = {};
  if (sort == "newest") {
    sortOption.createdAt = -1;
  }
  if (sort == "oldest") {
    sortOption.createdAt = 1;
  }

  const tasks = await Task.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort(sortOption);

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "task fetched successfully"));
});

//get task statistics
const getTaskStats = asyncHandler(async (req, res) => {
  const totalTask = await Task.countDocuments({
    owner: req.user._id,
  });
  const completedTask = await Task.countDocuments({
    owner: req.user._id,
    status: "completed",
  });
  const pendingTask = await Task.countDocuments({
    owner: req.user._id,
    status: "pending",
  });
  const priorityTask = await Task.countDocuments({
    owner: req.user._id,
    priority: "high",
  });

  let completionPercentage = 0;

  if (totalTask > 0) {
    completionPercentage = (completedTask / totalTask) * 100;
  }

  const stat = {
    totalTask,
    completedTask,
    pendingTask,
    priorityTask,
    completionPercentage,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stat, "Task statistics fetched successfully"));
});

 //filter by soft delete
  const softDelete = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findOne({
      _id: taskId,
      owner: req.user._id,
      
    });
    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    task.isDeleted = true;
    await task.save();

    return res
      .status(200)
      .json(new ApiResponse(200, task, "Task deleted successfully"));
  });

export {
  createTask,
  getAllTask,
  getTaskById /*getTaskByTitle*/,
  updateTask,
  deleteTask,
  searchTask,
  getTaskStats,
  softDelete
};
