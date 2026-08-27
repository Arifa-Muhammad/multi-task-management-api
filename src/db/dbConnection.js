
import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"


import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB= async()=>{
    try {
        const connectInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MONGODB connected !! DB HOST: ${connectInstance.connection.host}`);
        
    } catch (error) {
        console.log("MONGODB connection error: ",error);
        process.exit(1)
        
    }
}

export default connectDB