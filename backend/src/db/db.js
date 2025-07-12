import mongoose from "mongoose";
import { db_name } from "../constants.js";
 
const connectDB=async()=>{

    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_URI}/${db_name}`)
        console.log("mongodb connected successfully");
    } catch (error) {
        console.log("Mongodb Error",error);
    }
}
export default connectDB;