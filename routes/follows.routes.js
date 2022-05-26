import {Router} from "express"
import * as followController from '../controllers/follow.controller.js'

const router = Router();

router.get('/following',followController.following)
//router.get('/followers',followController.followers)

export default router;