
import Express from "express";
import joi from "joi";
import {CustomApiError} from "../services/error_handling_services";

/// Errors that occur in all middleware are forwarded to this middleware. here the errors are parsed and error information is sent to the client side.
export default function(err : any, req: Express.Request, res: Express.Response, next: Express.NextFunction){
  if(err instanceof joi.ValidationError){
    return res.status(422).send(err.details);
  }
  else if(err instanceof CustomApiError){
    return res.status(err.status_code).send({
      error_type: err.error_type,
      description: err.error_value
    })
  }
  else{
    if(err instanceof Error){
      if(err.message.split(":")[0] == "***-/-/unsupported file type"){
        return res.status(400).send(`unsupported file type:${err.message.split(":")[1]}`);
      }
      else{
        console.log(err);
        return res.status(500).send("an error occured on server");
      }
    }
  }
}
