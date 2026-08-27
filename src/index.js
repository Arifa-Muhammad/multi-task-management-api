//require('dotenv').config({path: './.enc'})
import dotenv from "dotenv"// why we import dotenv bcz when main file excute, all .env early as possible, and used with experimental features
import connectDB from "./db/dbConnection.js";

dotenv.config({
    path: './.env'
})


connectDB();






















// import express from "express"


// const app= express()
// (async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(err)=>{
//             console.log("App is not able to talk..",err)
//             throw err
//         })
//         app.listen(process.env.PORT, ()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
    
//         })
//     } catch (error) {
//         console.log("Error: ", error)
//         throw error
//     }
// })()
