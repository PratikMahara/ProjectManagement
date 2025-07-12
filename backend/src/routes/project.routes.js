import {Router } from 'express';
import saveProject from '../controller/project.controller.js'
const router=Router();

router.route('/save').post(saveProject);
export default router;