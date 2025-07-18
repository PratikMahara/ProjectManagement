import {Router} from 'express';
import { saveMaterial,getAllMaterial,deleteMaterial, updateMaterial } from '../controller/material.controller.js';
const router=Router();

router.post('/savemat',saveMaterial);
router.get('/getmat',getAllMaterial);
router.delete('/delmat/:id',deleteMaterial)
router.put('/updatemat/:id',updateMaterial)
export default router;


