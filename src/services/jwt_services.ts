
import express from "express";
import { ExPayload } from "../types/extended_jwt_payload";
import * as jwt from 'jsonwebtoken';
import { error_handling_services } from "./error_handling_services";
import { errorTypes } from "../models/error_types";

export default class JwtServices{
  private static _instance: JwtServices;
  private constructor() {}
  public static get instance(): JwtServices {
    if(JwtServices._instance == null) JwtServices._instance = new JwtServices();
    return this._instance;
  }

  createNewJwtTokenWithRefreshToken (refreshToken: string): string {
    try {
      const validatingRefreshToken = jwt.verify(refreshToken, process.env.jwt_refresh_secret as string) as ExPayload;
  
      const newToken = jwt.sign({id: validatingRefreshToken.id}, process.env.jwt_secret as string, {expiresIn: "1 hour"});
      return newToken;
    } catch (error) {
      if(error instanceof Error && error.message == "jwt expired"){
        //TODO: redirecting authentication again
        throw error_handling_services({error_type: errorTypes.expiredRefreshToken});
      }
      else{
        throw error;
      }
    }
  }


  validateJwt(req: express.Request, res: express.Response, next: express.NextFunction) {
    const jwtToken = req.headers["x-access-key"];
    const jwtRefreshToken = req.headers["x-access-refresh-key"];
  
    if(!jwtToken || !jwtRefreshToken) {
      return next(error_handling_services({error_type: errorTypes.jwtError}));
    }
    // verifying the jwt token
    try {
      const decoded  = jwt.verify(jwtToken as string, process.env.jwt_secret as string) as ExPayload;
      req.decoded = {id: decoded.id};
      res.setHeader("x-access-key",jwtToken);
      return next();
    } catch (error) {
      if(error instanceof Error && (error.message == "jwt expired" || error.message == "invalid token")){
        // creating new jwt token
        try {
          const newToken: string = JwtServices.instance.createNewJwtTokenWithRefreshToken(jwtRefreshToken as string);
          req.token = newToken;
          res.setHeader("x-access-key",req.token);
          req.decoded = {id: (jwt.decode(req.token) as ExPayload).id};
          return next();
        } catch (error) {
          return next(error);
        }
      }
      else if(error instanceof Error && error.message == "jwt malformed"){
        return next(error_handling_services({error_type: errorTypes.jwtError, value: "sended malformed jwt token"}));
      }
      else{
        return next(error);
      }
    }
  
  }


  createJwtTokens(id: string): {jwt_token: string, refresh_token: string} {
    const token = jwt.sign({ id: id }, process.env.jwt_secret as string, { expiresIn: "1 hour" });
    const refreshToken = jwt.sign({id: id}, process.env.jwt_refresh_secret as string, {expiresIn: "1 day"});
    return {jwt_token: token, refresh_token: refreshToken};
  }
}