import {body, validationResult } from "express-validator"
import { ApiError } from "../utils/apiErrors";

 const registerValidation= [
    
    body("username")
    .trim()
    .notEmpty().withMessage("username required")
    .isLength({min:5, max: 10}).withMessage("length in between 5 to 10 character")
    .toLowerCase()
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("only allowed letters,numbers,and underscore(_)"),
    
    body("email")
    .trim()
    .notEmpty().withMessage("email required")
    .isEmail().withMessage("correct email format is this (e.g., example@mail.com)!")
    .toLowerCase(),

    body("fullName")
    .trim()
    .notEmpty().withMessage("fullname required"),

    body("password")
    .notEmpty().withMessage("password required")
    .isLength({min:8}).withMessage("password should be atleast 8 character")

];

const validate=(req,res,next)=>{
    const errors= validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ApiError(400,"Validation failed!! ",errors.array())
        ) 
    }
    next()
}

export{registerValidation, validate}