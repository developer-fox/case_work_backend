import rateLimit from "express-rate-limit";
import ms from "ms";
import environment from '../config/environment';
const mongoStore = require("rate-limit-mongo");

/// A class that will limit the number of requests sent in a given time.
class RateLimitService{
  /// With this middleware, no more than 300 requests per minute are allowed from an ip address.
  static limiter =  rateLimit({
    windowMs: ms("1m"),
    max: 300,
    store: new mongoStore({
      uri: environment.mongodb_url,
      expireTimeMs: ms("10m"),
      collectionName: "rate_records"
    }),
    standardHeaders: false, 
    legacyHeaders: true,
  })
}

export {RateLimitService};