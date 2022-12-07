import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import url from 'url';

require("dotenv").config();

const getPlaceDetails = async (req: Request, res: Response, next: NextFunction) => {
    const frontendParams = url.parse(req.url, true).query;
    
    const params = {
        params: {
            key: process.env.GMAPS_API_KEY,
            place_id: frontendParams.place_id,
            fields: 'url',                          // Edit this to include more fields if needed
        }
    }

    const result: AxiosResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, params );

    let details = null;

    try {
        details = result.data.result;

        details = {
            url: details.url,
        };
    }
    catch {
        return res.status(500).json({ error: 'Error fetching url from Google Places API' })
    }

    return res.status(200).json((details))
}

export default { getPlaceDetails };