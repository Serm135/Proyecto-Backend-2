import {Router} from "express"
import * as followController from '../controllers/follow.controller.js'

const router = Router();

router.get('/following',followController.following)
router.get('/followers',followController.followers)
router.post('/request',followController.request)
router.post('/response',followController.response)

export default router;