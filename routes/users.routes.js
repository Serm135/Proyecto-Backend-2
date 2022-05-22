import {Router} from "express"
import * as userController from '../controllers/user.controller.js'

const router = Router();

//router.get('/',userController.get_user)
router.post('/',userController.register)
router.post('/login',userController.login)

export default router;