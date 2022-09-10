import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import url from 'url';

require("dotenv").config();

const getNearbyRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    let frontendParams = url.parse(req.url, true).query;

    const radius = frontendParams.distance as string;

    const params = {
        params: {
            key: process.env.GMAPS_API_KEY,
            location: frontendParams.location,
            radius: convertStringMilesToMeters(radius),
            type: 'restaurant'
        }
    }

    let result: AxiosResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, params );
    return res.status(200).json(result.data)
}

function convertStringMilesToMeters(distanceInMiles: string) {
    return parseInt(distanceInMiles)*1609.34
}

export default { getNearbyRestaurants };