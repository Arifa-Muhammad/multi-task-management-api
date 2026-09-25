import { Router } from "express";
import {
  changePasswordValidation,
  loginValidation,
  registerValidation,
  updateProfileValidation,
  validate,
} from "../middlewares/validation.middleware.js";
import {
  changePassword,
  getCurrentUserProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAvatar,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();
// console.log("routing start");

router.post(
  "/register",
  authLimiter,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),

  // (req, res, next) => {
  //   console.log("✅ MULTER DONE");
  //   console.log("BODY:", req.body);
  //   console.log("FILES:", req.files);
  //   next();
  // },
  registerValidation,
  validate,
  registerUser,
);
router.route("/login").post(authLimiter,loginValidation, validate, loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/get-profile").get(verifyJWT, getCurrentUserProfile);

router
  .route("/change-password")
  .put(verifyJWT, changePasswordValidation, validate, changePassword);

router
  .route("/update-profile")
  .put(verifyJWT, updateProfileValidation, validate, updateUserProfile);

router.route("/generate-Access-Token").post(refreshAccessToken);

router.put("/update-avatar", verifyJWT, upload.single("avatar"), updateAvatar);
export default router;
