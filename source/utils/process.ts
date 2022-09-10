/** source/routes/process.ts */

import { ResultFilterParams, PriceOptions, FindMeFoodResult } from "./types";

const PLACES_API_OPERATIONAL_STRING = "OPERATIONAL";

export function processAllAPIResults(
  results: any[],
  params: ResultFilterParams
): any[] {
  const filteredResults = filterAllResultsByPreferences(results, params);
  return postProcessAllFilteredResults(filteredResults);
}

function postProcessAllFilteredResults(
  filteredResults: any[],
  params: ResultFilterParams
): FindMeFoodResult[] {
  const filteredResultsDistances = filteredResults.map((res) => {
    return calculateDistanceInMiles(
      Number(params.currentLat),
      Number(params.currentLong),
      res.geometry.location.lat,
      res.geometry.location.lng
    );
  });
  const finalResults = filteredResults.map((item, index) => {
    const finalResult = "TBD";
  });
  // add distance
  // process url
  // cast to current info
  return finalResults;
}

/**
 *
 * @param results Array of API results from Places API with all restaurant listings
 * @param params interface with all filter params from user
 * @returns fully filtered list of results
 */
function filterAllResultsByPreferences(
  results: any[],
  params: ResultFilterParams
): any[] {
  return results.filter((result) => {
    return (
      filterByOpen(result) &&
      filterRatingsQuality(result, params.minRating, params.minNumReviews) &&
      (params.maxPriceLevel !== undefined
        ? fitlerByPrice(result, params.maxPriceLevel)
        : true)
    );
  });
}

/**
 * Filter util function to calculate whether a result satisfies minRating and minNumReviews constratints.
 *
 * @param result — API result from Places API with all restaurants
 * @param minRating — minimum rating for all eligbile APIs
 * @returns True if a place's rating is greater than minRating
 */
const filterRatingsQuality = (
  result: any,
  minRating: number,
  minNumReviews: number
): boolean => {
  return (
    result.rating >= minRating && result.user_ratings_total >= minNumReviews
  );
};

/**
 * Filter util function to calculate whether a result is within the max distance
 *
 * @param result — API result from Places API with all restaurants
 * @param maxDistance — furthest distance from current location, in miles
 * @returns True if place element is within the maxDistance
 */
const filterByDistance = (
  result: any,
  maxDistance: number,
  currentLat: number,
  currentLong: number
): boolean => {
  const resultLat: number = result.geometry.location.lat;
  const resultLong: number = result.geometry.location.lng;
  return (
    calculateDistanceInMiles(currentLat, currentLong, resultLat, resultLong) <=
    maxDistance
  );
};

/**
 *
 * @param result API result from Places API with all restaurants
 * @returns True if restaurant is currently open and operational
 */
const filterByOpen = (result: any): boolean => {
  return (
    result.business_status === PLACES_API_OPERATIONAL_STRING &&
    result.opening_hours.open_now
  );
};

/**
 *
 * @param result API result from Places API with all restaurants
 * @param highestPrice int corresponding to a price level (see PriceOptions enum)
 * @returns True if restaurant/result is within the price range
 */
const fitlerByPrice = (result: any, highestPrice: number): boolean => {
  const highestPriceValue = PriceOptions[highestPrice];
  return result.price_level <= highestPriceValue;
};

/**
 * Util function to calculate the distance between current location and result location in miles
 * Reference: https://www.geodatasource.com/developers/javascript
 *
 * @param currentLat current location of user (latitude)
 * @param currentLong ''' (longitude)
 * @param placeLat location of result (latitude)
 * @param placeLong ''' (longitude)
 * @returns distance between both locations in miles (as the crow flies)
 */
function calculateDistanceInMiles(
  currentLat: number,
  currentLong: number,
  placeLat: number,
  placeLong: number
): number {
  if (currentLat == placeLat && currentLong == placeLong) {
    return 0;
  } else {
    var radlat1 = (Math.PI * currentLat) / 180;
    var radlat2 = (Math.PI * placeLat) / 180;
    var theta = currentLong - placeLong;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist;
  }
}
