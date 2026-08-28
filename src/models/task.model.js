import mongoose, { Schema } from "mongoose";

const taskSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true

    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    priority:{
        type: String,
        enum:["low","medium","high"],
        required:true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    dueDate:{
        type: Date,
        required: true
    }
},{timestamps: true})

export const Task=mongoose.model("Task", taskSchema)