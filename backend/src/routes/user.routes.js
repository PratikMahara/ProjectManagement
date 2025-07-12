import { Router } from "express";
import { loginUser,register} from "../controller/user.controller.js";
const router =Router();
router.post('/register',register);
router.post('/login',loginUser);

export default router;