import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import url from 'url';
import { processAllAPIResults } from '../utils/process';
import { ResultFilterParams } from '../utils/types';

require("dotenv").config();

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

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

    let localNextPageToken = result.data.next_page_token;
    let counter = 0

    let restaurants = result.data.results;

    // Get top 60 results from Google Maps through paging
    while (localNextPageToken != null && counter < 2) {
        
        const tempParams = {
            params: {
                key: process.env.GMAPS_API_KEY,
                pagetoken: localNextPageToken
            }
        };

        // Token needs some time to become usable
        await sleep(2000);

        let temp: AxiosResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, tempParams );
        console.log('page ' + (counter + 2) + ' has ' + temp.data.results.length + ' results');

        restaurants = [...restaurants, ...temp.data.results]
        counter++;

        localNextPageToken = temp.data.next_page_token;
    }

    return res.status(200).json(processAllAPIResults(restaurants, resultFilters))
}

function convertStringMilesToMeters(distanceInMiles: string) {
    return parseFloat(distanceInMiles)*1609.34
}

export default { getNearbyRestaurants };