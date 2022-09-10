import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import url from 'url';
import { processAllAPIResults } from '../utils/process';
import { ResultFilterParams } from '../utils/types';

require("dotenv").config();

const getNearbyRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    let frontendParams = url.parse(req.url, true).query;

    const radius = convertStringMilesToMeters(frontendParams.distance as string);
    const latLongArray = (frontendParams.location as string).split(',');

    const params = {
        params: {
            key: process.env.GMAPS_API_KEY,
            location: frontendParams.location,
            radius: radius,
            type: 'restaurant',
            opennow: true
        }
    }

    const resultFilters: ResultFilterParams = {
        minRating: parseFloat(frontendParams.stars as string),
        minNumReviews: parseFloat(frontendParams.reviews as string),
        currentLat: latLongArray[0],
        currentLong: latLongArray[1],
    }

    let result: AxiosResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, params );
    return res.status(200).json(processAllAPIResults(result.data.results, resultFilters))
}

function convertStringMilesToMeters(distanceInMiles: string) {
    return parseInt(distanceInMiles)*1609.34
}

export default { getNearbyRestaurants };