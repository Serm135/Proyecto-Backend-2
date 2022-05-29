import {Router} from "express";
import * as postController from "../controllers/post.controller.js"

const router = Router()

router.post('/',postController.create)
router.get('/', postController.information)
router.post('/like',postController.like)
router.get('/liked-by',postController.liked_by)
router.get('/saved-by',postController.saved_by)
router.post('/save',postController.save)

export default router;