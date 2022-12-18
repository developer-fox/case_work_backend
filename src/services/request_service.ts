import {AxiosInstance } from './../../node_modules/axios/index.d';
import axios from "axios";
import environment from "../config/environment";

/// class that makes requests to different web services
class RequestService{
  /// axios is an http request package.
  /// this is how we created an axios configuration. We will do all our requests through this configuration.
  axiosInstance : AxiosInstance = axios.create({
    headers: {
      "authorization": environment.collect_api_token,
      'content-type':'application/json',  
      "Accept-Encoding": "gzip,deflate,compress"
    },
    baseURL: "https://api.collectapi.com/weather/getWeather?data.lang=tr",
  });

  private static _instance: RequestService;
  private constructor() {}
  
  public static get instance(): RequestService {
    if(RequestService._instance == null) RequestService._instance = new RequestService();
    return this._instance;
  }
  
  /// With this method, we make the request to give the weekly weather condition of the city given as a parameter.
  async getWeatherOfWeekRequest(city: string) {
    const fetchResult = await this.axiosInstance.get(`&data.city=${city}`);
    return fetchResult.data;
  }
}

export {RequestService};