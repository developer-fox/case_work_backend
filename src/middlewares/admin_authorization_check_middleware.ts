
import express  from "express";
import environment from "../config/environment";
import { errorTypes } from "../models/error_types";
import { error_handling_services } from "../services/error_handling_services";

/// This middleware checks if there is an admin key in the header and if it is correct. If it exists and is true, it will let the request pass.
function adminAuthorizationCheck(req: express.Request, res: express.Response, next: express.NextFunction){
  try {
    if(req.headers["admin-key"] != environment.admin_password) return next(error_handling_services({error_type: errorTypes.authorizationError, value: "action denied"}))
    return next();
  } catch (error) {
    return next(error);
  }
}

export default adminAuthorizationCheck;