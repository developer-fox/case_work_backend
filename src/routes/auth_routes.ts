import express from 'express';
import { userJoiSchema, userModel } from '../entities/user';
import { error_handling_services } from '../services/error_handling_services';
import { errorTypes } from '../models/error_types';
import JwtServices from '../services/jwt_services';
import bcrypt from "bcrypt";

const router = express.Router();

router.put("/signup", async(req: express.Request, res: express.Response, next: express.NextFunction)=>{
  try {
    const{error,value} = userJoiSchema.validate({
      email: req.body.email,
      password: req.body.password,
    })

    if(error == undefined){
      const fetchResult = await userModel.findOne({email: value.email});
      if(fetchResult != null) return next(error_handling_services({error_type: errorTypes.logicalError, value: "this is email already using"}));
      const hashedPassword = await bcrypt.hash(value.password, 13);
      const newUser = new userModel({
        "email": value.email,
        "password": hashedPassword,
      });
      await newUser.save();
      const tokens = JwtServices.instance.createJwtTokens(newUser.id);
      return res.send({status: errorTypes.successfuly, tokens});
    }
    return next(error);
  } catch (error) {
    if(error instanceof Error) return next(error);
  }
})

router.post("/login", async(req: express.Request, res: express.Response, next: express.NextFunction)=>{
  try {
    const {error,value} = userJoiSchema.validate({
      email: req.body.email,
      password: req.body.password,
    });

    if(error == undefined){
      const user = await userModel.findOne({email: value.email}).select("-activities");
      if(user == null) return next(error_handling_services({error_type: errorTypes.dataNotFound, value: "user not found"}));

      const passwordComparing = await bcrypt.compare(value.password, user.password as string);
      if(!passwordComparing)  return next(error_handling_services({error_type: errorTypes.logicalError, value:"wrong password"}));

      const tokens = JwtServices.instance.createJwtTokens(user.id);
      return res.send(tokens);

    }
    return next(error);
  } catch (error) {
    if(error instanceof Error) return next(error);
  }
})


export default router;