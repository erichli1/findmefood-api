/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import url from 'url';

require("dotenv").config();

interface Post {
    userId: Number;
    id: Number;
    title: String;
    body: String;
}

interface FrontendParams {
    
}

// getting all posts
// const getPosts = async (req: Request, res: Response, next: NextFunction) => {
//     // get some posts
//     let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
//     let posts: [Post] = result.data;
//     return res.status(200).json({
//         message: posts
//     });
// };

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