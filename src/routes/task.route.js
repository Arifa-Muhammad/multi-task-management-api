import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getAllTask,
  getTaskById,
  getTaskStats,
  searchTask,
  softDelete,
  updateTask /*getTaskByTitle */,
} from "../controllers/task.controller.js";
import { getRecentActivity } from "../controllers/activity.controller.js";

const router2 = Router();

router2.route("/create-task").post(verifyJWT, createTask);

router2.route("/get-tasks").get(verifyJWT, getAllTask);

//router2.route("/get-task").get(verifyJWT,getTaskByTitle)
router2.route("/get-task/:taskId").get(verifyJWT, getTaskById);

router2.route("/update-task/:taskId").put(verifyJWT, updateTask);

router2.route("/delete-task/:taskId").delete(verifyJWT, deleteTask);

router2.get("/stat", verifyJWT, getTaskStats);

router2.route("/search-task").get(verifyJWT, searchTask);

router2.delete("/soft-delete/:taskId", verifyJWT, softDelete)


router2.get("/activity", verifyJWT, getRecentActivity)
export default router2;
