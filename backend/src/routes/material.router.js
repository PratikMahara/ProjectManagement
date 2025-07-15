import {Router} from 'express';
import { saveMaterial,getAllMaterial } from '../controller/material.controller.js';
const router=Router();

router.post('/savemat',saveMaterial);
router.get('/getmat',getAllMaterial);
export default router;


