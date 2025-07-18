import {Router} from 'express'
import { addStaff,getAllStaff ,deleteStaff,updateStaff} from '../controller/staff.controller.js';
const router=Router();

router.post('/addstaff',addStaff);
router.get('/getstaff',getAllStaff);
router.delete('/deletestaff/:id',deleteStaff);
router.put('/updatestaff/:id',updateStaff);
export default router;
