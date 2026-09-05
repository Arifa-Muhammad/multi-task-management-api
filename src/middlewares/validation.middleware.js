import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/apiErrors.js";

const registerValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username required")
    .isLength({ min: 5, max: 10 })
    .withMessage("length in between 5 to 10 character")
    .toLowerCase()
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("only allowed letters,numbers,and underscore(_)"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("correct email format is this (e.g., example@mail.com)!")
    .toLowerCase(),

  body("fullName").trim().notEmpty().withMessage("fullname required"),

  body("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 8 })
    .withMessage("password should be atleast 8 character"),
];
const loginValidation = [
  body("username").trim().notEmpty().withMessage("username required"),

  body("password").notEmpty().withMessage("password required.."),
];
const changePasswordValidation = [
  body("oldPassword").notEmpty().withMessage("old password required"),

  body("newPassword").notEmpty().withMessage("new password field required"),
];
const updateProfileValidation = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage("username must be between 5 and 10 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("only letters, numbers and underscore are allowed"),

  body("email")
    .optional()
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("fullName cannot be empty"),
];

const createTaskValidation = [
  body("title").trim().notEmpty().withMessage("Task title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Task description is required"),

  body("priority")
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium or high"),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation failed!! ", errors.array()));
  }
  next();
};

export {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  updateProfileValidation,
  createTaskValidation,
  validate,
};
