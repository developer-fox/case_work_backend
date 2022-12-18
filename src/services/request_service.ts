import { Axios, AxiosStatic, AxiosInstance } from './../../node_modules/axios/index.d';
import axios from "axios";
import environment from "../config/environment";

class RequestService{
  axiosInstance : AxiosInstance = axios.create({
    headers: {"authorization": environment.collect_api_token,'content-type':'application/json',  "Accept-Encoding": "gzip,deflate,compress"},
    baseURL: "https://api.collectapi.com/weather/getWeather?data.lang=tr",
  });

  private static _instance: RequestService;
  private constructor() {
  
  }
  public static get instance(): RequestService {
    if(RequestService._instance == null) RequestService._instance = new RequestService();
    return this._instance;
  }
  
  async getWeatherOfWeekRequest(city: string) {
    try {
      const fetchResult = await this.axiosInstance.get(`&data.city=${city}`);
      return fetchResult.data;
    } catch (error) {
      throw error;
    }
  }

}

export {RequestService};
