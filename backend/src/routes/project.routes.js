import {Router } from 'express';
import {saveProject,getAllProjects,saveProjects} from '../controller/project.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js';
const router=Router();

router.route('/save').post(saveProject);
router.route('/getproject').get(getAllProjects);
router.route('/saves').post(saveProjects);
export default router;