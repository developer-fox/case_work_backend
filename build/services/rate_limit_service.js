"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitService = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const ms_1 = __importDefault(require("ms"));
const environment_1 = __importDefault(require("../config/environment"));
const mongoStore = require("rate-limit-mongo");
/// A class that will limit the number of requests sent in a given time.
class RateLimitService {
}
exports.RateLimitService = RateLimitService;
/// With this middleware, no more than 300 requests per minute are allowed from an ip address.
RateLimitService.limiter = (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("1m"),
    max: 300,
    store: new mongoStore({
        uri: environment_1.default.mongodb_url,
        expireTimeMs: (0, ms_1.default)("10m"),
        collectionName: "rate_records"
    }),
    standardHeaders: false,
    legacyHeaders: true,
});
