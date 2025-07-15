import { Router } from "express";
import { loginUser,register,getUser} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router =Router();
router.post('/register',register);
router.post('/login',loginUser);
router.get('/me',verifyJWT,getUser);
export default router;