import { Router } from "express";
import { registerValidation, validate } from "../middlewares/validation.middleware";

const router= Router()

router.route("/register").post(registerValidation,validate,registerUser)

export default router