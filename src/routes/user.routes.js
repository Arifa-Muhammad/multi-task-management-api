import { Router } from "express";
import { registerValidation, validate } from "../middlewares/validation.middleware.js";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router= Router()

router.route("/register").post(upload.fields([{
    name: "avatar",
    maxCount: 1
}]),registerValidation,validate,registerUser)

export default router