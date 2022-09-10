/** source/routes/posts.ts */
import express from 'express';
import controller from '../controllers/posts';
const router = express.Router();

// router.get('/posts', controller.getPosts);
router.get('/findfood', controller.getNearbyRestaurants)

export = router;