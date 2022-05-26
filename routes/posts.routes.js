import {Router} from "express";
import * as postController from "../controllers/post.controller.js"

const router = Router()

router.post('/',postController.create)
router.get('/', postController.information)

export default router;