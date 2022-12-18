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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = __importDefault(require("./config/environment"));
const error_handler_middleware_1 = __importDefault(require("./middlewares/error_handler_middleware"));
const auth_routes_1 = __importDefault(require("./routes/auth_routes"));
const activity_routes_1 = __importDefault(require("./routes/activity_routes"));
const admin_routes_1 = __importDefault(require("./routes/admin_routes"));
const jwt_services_1 = __importDefault(require("./services/jwt_services"));
const axios_1 = __importDefault(require("axios"));
const error_handling_services_1 = require("./services/error_handling_services");
const error_types_1 = require("./models/error_types");
const request_service_1 = require("./services/request_service");
const admin_authorization_check_middleware_1 = __importDefault(require("./middlewares/admin_authorization_check_middleware"));
mongoose_1.default.set("strictQuery", true);
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.urlencoded());
app.use(express_1.default.json());
const instance = axios_1.default.create({
    headers: { "authorization": environment_1.default.collect_api_token, 'content-type': 'application/json', "Accept-Encoding": "gzip,deflate,compress" },
    baseURL: "https://api.collectapi.com/weather/getWeather?data.lang=tr",
});
app.use("/test", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchResult = yield request_service_1.RequestService.instance.getWeatherOfWeekRequest("ankara");
        if (fetchResult.success != undefined && !fetchResult.success) {
            return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.invalidValue, value: "city" }));
        }
        return res.send(fetchResult);
    }
    catch (error) {
        return next(error);
    }
}));
app.use("/auth", auth_routes_1.default);
app.use("/activity", jwt_services_1.default.instance.validateJwt, activity_routes_1.default);
app.use("/admin", admin_authorization_check_middleware_1.default, admin_routes_1.default);
app.use(error_handler_middleware_1.default);
mongoose_1.default.connect(environment_1.default.mongodb_url).then((connection) => {
    server.listen(8080);
})
    .catch((error) => {
    console.log(error);
});
