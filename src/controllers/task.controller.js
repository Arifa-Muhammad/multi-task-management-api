import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/task.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiErrors.js";
import { Activity } from "../models/activity.model.js";

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

  //activity create
  await Activity.create({
    user: req.user._id,
    task: task._id,
    action: "created",
    message: `task "${task.title}" created`,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "task created successfully!!"));
});

//2. Read all task
const getAllTask = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    owner: req.user._id,
    isDeleted: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "task fetched successfully.."));
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
    isDeleted: false,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "task fetched by id successfully"));
});
//4. update task
const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, priority, status, dueDate } = req.body;

  const task = await Task.findOne({
    _id: taskId,
    owner: req.user._id,
    isDeleted: false,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const oldStatus = task.status;

  task.title = title;
  task.description = description;
  task.priority = priority;
  task.status = status;
  task.dueDate = dueDate;

  await task.save();

  const action =
    oldStatus !== "completed" && status === "completed"
      ? "completed"
      : "updated";

  await Activity.create({
    user: req.user._id,
    task: task._id,
    action,
    message:
      action === "completed"
        ? `Task "${task.title}" completed`
        : `Task "${task.title}" updated`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

5; //delete task
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findOneAndDelete({
    owner: req.user._id,
    _id: taskId,
  });

  if (!task) {
    throw new ApiError(404, "task not found ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "task deleted successfully.."));
});

//search
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
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
    isDeleted: false,
  };

  //search by title
  if (title?.trim()) {
    const safeTitle = escapeRegex(title.trim());

    filter.title = {
      $regex: safeTitle,
      $options: "i",
    };
  }
  if (title) {
    const safeTitle = escapeRegex(title.trim());
    filter.title = {
      $regex: safeTitle,
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

  const totalTasks = await Task.countDocuments(filter);
  const totalPages = Math.ceil(totalTasks / Number(limit));

  const pagination = {
    totalTasks,
    totalPages,
    currentPage: Number(page),
    limit: Number(limit),
    hasNextPage: Number(page) < totalPages,
    hasPreviousPage: Number(page) > 1,
  };
  return res
    .status(200)
    .json(
      new ApiResponse(200, { tasks, pagination }, "task fetched successfully"),
    );
});

//get task statistics
const getTaskStats = asyncHandler(async (req, res) => {
  const totalTask = await Task.countDocuments({
    owner: req.user._id,
    isDeleted: false,
  });
  const completedTask = await Task.countDocuments({
    owner: req.user._id,
    status: "completed",
    isDeleted: false,
  });
  const pendingTask = await Task.countDocuments({
    owner: req.user._id,
    status: "pending",
    isDeleted: false,
  });
  const priorityTask = await Task.countDocuments({
    owner: req.user._id,
    priority: "high",
    isDeleted: false,
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
    isDeleted: false,
  });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  task.isDeleted = true;
  await task.save();

  // Activity create
  await Activity.create({
    user: req.user._id,
    task: task._id,
    action: "deleted",
    message: `Task "${task.title}" deleted`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task deleted successfully"));
});

//restore soft delete
const restoreTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findOne({
    _id: taskId,
    owner: req.user._id,
    isDeleted: true,
  });

  if (!task) {
    throw new ApiError(404, "Deleted task not found");
  }

  task.isDeleted = false;

  await task.save();

  // Activity create
  await Activity.create({
    user: req.user._id,
    task: task._id,
    action: "restored",
    message: `Task "${task.title}" restored`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task restored successfully"));
});

export {
  createTask,
  getAllTask,
  getTaskById /*getTaskByTitle*/,
  updateTask,
  deleteTask,
  searchTask,
  getTaskStats,
  softDelete,
  restoreTask,
};
