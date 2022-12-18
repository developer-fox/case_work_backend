"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestService = void 0;
const axios_1 = __importDefault(require("axios"));
const environment_1 = __importDefault(require("../config/environment"));
class RequestService {
    constructor() {
        this.axiosInstance = axios_1.default.create({
            headers: { "authorization": environment_1.default.collect_api_token, 'content-type': 'application/json', "Accept-Encoding": "gzip,deflate,compress" },
            baseURL: "https://api.collectapi.com/weather/getWeather?data.lang=tr",
        });
    }
    static get instance() {
        if (RequestService._instance == null)
            RequestService._instance = new RequestService();
        return this._instance;
    }
    getWeatherOfWeekRequest(city) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchResult = yield this.axiosInstance.get(`&data.city=${city}`);
                return fetchResult.data;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.RequestService = RequestService;
