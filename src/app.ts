
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import environment from './config/environment';
import error_handler_middleware from './middlewares/error_handler_middleware';
import authRoutes from './routes/auth_routes';
import activityRoutes from './routes/activity_routes';
import adminRoutes from './routes/admin_routes';
import JwtServices from './services/jwt_services';
import axios from 'axios';
import { error_handling_services } from './services/error_handling_services';
import { errorTypes } from './models/error_types';
import { RequestService } from './services/request_service';
import adminAuthorizationCheck from './middlewares/admin_authorization_check_middleware';

mongoose.set("strictQuery", true);

const app: express.Application = express();
const server: http.Server = http.createServer(app);

app.use(express.urlencoded());
app.use(express.json());

const instance = axios.create({
  headers: {"authorization": environment.collect_api_token,'content-type':'application/json',  "Accept-Encoding": "gzip,deflate,compress"},
  baseURL: "https://api.collectapi.com/weather/getWeather?data.lang=tr",
});

app.use("/test",async (req: express.Request, res: express.Response, next: express.NextFunction)=>{
 try {
  const fetchResult = await RequestService.instance.getWeatherOfWeekRequest("ankara");
  if(fetchResult.success != undefined && !fetchResult.success){
    return next(error_handling_services({error_type: errorTypes.invalidValue, value: "city"}));
  }
  return res.send(fetchResult);
 } catch (error) {
  return next(error);
 }
});

app.use("/auth", authRoutes);
app.use("/activity", JwtServices.instance.validateJwt, activityRoutes);
app.use("/admin", adminAuthorizationCheck, adminRoutes);
app.use(error_handler_middleware);

mongoose.connect(environment.mongodb_url).then((connection)=>{
  server.listen(8080);
})
.catch((error)=>{
  console.log(error);
})