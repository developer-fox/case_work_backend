
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import environment from './config/environment';
import error_handler_middleware from './middlewares/error_handler_middleware';
import authRoutes from './routes/auth_routes';
import activityRoutes from './routes/activity_routes';
import adminRoutes from './routes/admin_routes';
import JwtServices from './services/jwt_services';
import adminAuthorizationCheck from './middlewares/admin_authorization_check_middleware';
import { RateLimitService } from './services/rate_limit_service';
import helmet from 'helmet';

mongoose.set("strictQuery", true);


// creating an express app
const app: express.Application = express();
//
// creating a http server
// If we wish, we can start listening to our express application directly. but if we want to add websocket service to our backend service, we have to change it. so it is more advantageous to do it this way.
const server: http.Server = http.createServer(app);
//
// this middleware only parses urlencoded bodies and only looks at requests
app.use(express.urlencoded());
// this middleware parses the body of the incoming request.
app.use(express.json());
//
// This middleware brings some basic security measures to our service using the helmet package.
// for details: https://www.npmjs.com/package/helmet
app.use(helmet());
//
// request limiter middleware
app.use(RateLimitService.limiter);

// routes
app.use("/auth", authRoutes);
app.use("/activity", JwtServices.instance.validateJwt, activityRoutes);
app.use("/admin", adminAuthorizationCheck, adminRoutes);
app.use(error_handler_middleware);

// mongodb database connection
mongoose.connect(environment.mongodb_url).then((connection)=>{
  server.listen(8080);
})
.catch((error)=>{
  console.log(error);
})