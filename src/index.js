//require('dotenv').config({path: './.enc'})
import dotenv from "dotenv"// why we import dotenv bcz when main file excute, all .env early as possible, and used with experimental features
import connectDB from "./db/dbConnection.js";
import {app} from "./app.js"

dotenv.config({
    path: './.env'
})


connectDB()
.then(()=>{
    app.on("error", (err)=>{
        console.log("ERROR: ",err);
        throw err;

    })
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`server is running at port : ${process.env.PORT}`);
        
    })
    
})
.catch((err)=>{
    console.log("MONGODB connection failed !!!", err);
    
})




















// import express from "express"
// import mongoose from "mongoose";
// import {DB_NAME} from "./constants.js"

// import dns from "dns";
// dns.setServers(["8.8.8.8", "1.1.1.1"]);

// const app= express();
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
//         console.log("MONGODB connected!! ");
        
//     } catch (error) {
//         console.log("Error: ", error)
//         throw error
//     }
// })()
