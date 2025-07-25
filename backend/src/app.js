import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express();
app.use(cors({
    origin:"https://projectmanagementfrontend.onrender.com",
    credentials:true
}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true, limit:"20kb"}))
app.use(cookieParser())
import userRouter from './routes/user.routes.js'
import projectRouter from './routes/project.routes.js'
import materialRouter from './routes/material.router.js'
import staffRouter from  './routes/staff.routes.js'
app.use('/api/user',userRouter)
app.use('/api/projects',projectRouter);
app.use('/api/material',materialRouter);
app.use('/api/staff',staffRouter);
export default app;
