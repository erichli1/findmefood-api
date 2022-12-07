import express from 'express';
import controller from '../controllers/restaurants';
import urlController from '../controllers/placesDetails';
const router = express.Router();

router.get('/findfood', controller.getNearbyRestaurants)
router.get('/geturl', urlController.getPlaceDetails)

export = router;