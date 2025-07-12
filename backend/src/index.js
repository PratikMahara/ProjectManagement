import app from "./app.js";
import dotenv from "dotenv"
import mongoose from "mongoose"
import { db_name } from "./constants.js";
import connectDB from "./db/db.js";
dotenv.config({
    path:'./.env'
})
const PORT=process.env.PORT || 5000;
connectDB()
.then(()=>{
    app.listen(PORT || 5000,()=>{
        console.log(`server is running on PORT: ${PORT}`)
    } )
})
.catch((error)=>{
    console.log("mongodb Error on index",error);
    })