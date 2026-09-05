import { Router } from "express";
import {
  changePasswordValidation,
  loginValidation,
  registerValidation,
  updateProfileValidation,
  validate,
} from "../middlewares/validation.middleware.js";
import { changePassword, getCurrentUserProfile, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
console.log("routing start");

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),

  (req, res, next) => {
    console.log("✅ MULTER DONE");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    next();
  },
  registerValidation,
  validate,
  registerUser,
);
router.route("/login").post(loginValidation, validate, loginUser);

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/get-profile").get(verifyJWT,getCurrentUserProfile)

router.route("/change-password").put(verifyJWT,changePasswordValidation,validate ,changePassword)

router.route("/update-profile").put(verifyJWT,updateProfileValidation, validate,updateUserProfile)

router.route("/generate-Access-Token").post(refreshAccessToken)
export default router;
