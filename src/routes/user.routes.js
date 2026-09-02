import { Router } from "express";
import { registerValidation, validate } from "../middlewares/validation.middleware.js";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router= Router()
console.log("routing start");

router.route("/register").post( upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),

    (req, res, next) => {
        console.log("✅ MULTER DONE");
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);
        next();
    },
registerValidation,
validate,
registerUser)

export default router