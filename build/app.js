"use strict";
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
const admin_authorization_check_middleware_1 = __importDefault(require("./middlewares/admin_authorization_check_middleware"));
const rate_limit_service_1 = require("./services/rate_limit_service");
const helmet_1 = __importDefault(require("helmet"));
mongoose_1.default.set("strictQuery", true);
// creating an express app
const app = (0, express_1.default)();
//
// creating a http server
// If we wish, we can start listening to our express application directly. but if we want to add websocket service to our backend service, we have to change it. so it is more advantageous to do it this way.
const server = http_1.default.createServer(app);
//
// this middleware only parses urlencoded bodies and only looks at requests
app.use(express_1.default.urlencoded());
// this middleware parses the body of the incoming request.
app.use(express_1.default.json());
//
// This middleware brings some basic security measures to our service using the helmet package.
// for details: https://www.npmjs.com/package/helmet
app.use((0, helmet_1.default)());
//
// request limiter middleware
app.use(rate_limit_service_1.RateLimitService.limiter);
// routes
app.use("/auth", auth_routes_1.default);
app.use("/activity", jwt_services_1.default.instance.validateJwt, activity_routes_1.default);
app.use("/admin", admin_authorization_check_middleware_1.default, admin_routes_1.default);
app.use(error_handler_middleware_1.default);
// mongodb database connection
mongoose_1.default.connect(environment_1.default.mongodb_url).then((connection) => {
    server.listen(8080);
})
    .catch((error) => {
    console.log(error);
});
