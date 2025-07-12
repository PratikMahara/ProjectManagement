import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true, limit:"20kb"}))
app.use(cookieParser())
import userRouter from './routes/user.routes.js'
import projectRouter from './routes/project.routes.js'
app.use('/api/user',userRouter)
app.use('/api/projects',projectRouter);
export default app;