import express from 'express';
import controller from '../controllers/restaurants';
const router = express.Router();

router.get('/findfood', controller.getNearbyRestaurants)

export = router;