export interface ResultFilterParams {
  minRating: number;
  minNumReviews: number;
  maxDistance: number;
  currentLat: number | string;
  currentLong: number | string;
  maxPriceLevel?: number;
}

export enum PriceOptions {
  FREE = 0,
  ONE_DOLLAR_SIGN = 1,
  TWO_DOLLAR_SIGNS = 2,
  THREE_DOLLAR_SIGNS = 3,
  FOUR_DOLLAR_SIGNS = 4,
}
