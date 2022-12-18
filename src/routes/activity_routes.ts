import express from 'express';
import { isValidObjectId } from 'mongoose';
import { activityJoiSchema, activityModel } from '../entities/activity';
import { userModel } from '../entities/user';
import { errorTypes } from '../models/error_types';
import { error_handling_services } from '../services/error_handling_services';
import { RequestService } from '../services/request_service';

const router = express.Router();

router.put("/create_activity", async(req: express.Request, res: express.Response, next: express.NextFunction) =>{
 try {
  const{error,value} = activityJoiSchema.validate({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    venue: req.body.venue,
    category: req.body.category,
    city: req.body.city,
  });

  if(error == undefined){
    const newActivity = new activityModel({
      "category": value.category,
      "city": value.city,
      "date": value.date,
      "description": value.description,
      "title": value.title,
      "venue": value.venue,
    });

    await newActivity.save();
    await userModel.findByIdAndUpdate(req.decoded?.id,{$addToSet: {"activities": newActivity._id}});
    return res.send({result: errorTypes.successfuly});
  }
  return next(error);
 } catch (error) {
  return next(error);
 }
});

router.get("/get_activities", async(req: express.Request, res: express.Response, next: express.NextFunction)=>{
  try {
    const fetchResult = await userModel.findById(req.decoded?.id).select("activities").populate("activities");
    return res.send(fetchResult?.activities.reverse());
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete_activity/:activity_id", async(req: express.Request, res: express.Response, next: express.NextFunction)=>{
  try {
    if(!isValidObjectId(req.params.activity_id)) return next(error_handling_services({error_type: errorTypes.invalidValue, value: "activity id"}));

    const fetchResult = await userModel.findOne({"activities": req.params.activity_id});
    if(fetchResult != null){

      if(fetchResult?.id != req.decoded?.id) return next(error_handling_services({error_type: errorTypes.authorizationError, value: "action denied"}));
      await activityModel.findByIdAndDelete(req.params.activity_id);
      await fetchResult.updateOne({
        $pull: {
          activities: req.params.activity_id
        }
      });
      return res.send({result: errorTypes.successfuly});

    }
    return next(error_handling_services({error_type: errorTypes.dataNotFound, value: "activity"}));

  } catch (error) {
    return next(error);
  }
});

router.post("/update_activity/:activity_id", async (req: express.Request, res: express.Response, next: express.NextFunction)=>{
  try {
    if(!isValidObjectId(req.params.activity_id)) return next(error_handling_services({error_type: errorTypes.invalidValue, value: "activity id"}));

    const{error,value} = activityJoiSchema.validate({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      venue: req.body.venue,
      category: req.body.category,
      city: req.body.city,
    });
  
    if(error == undefined){
      await activityModel.findByIdAndUpdate(req.params.activity_id, {
        $set: {
          "category": value.category,
          "city": value.city,
          "date": value.date.setHours(value.date.getHours() + 3),
          "description": value.description,
          "title": value.title,
          "venue": value.venue,
        }
      });
      return res.send({result: errorTypes.successfuly});
    }
    return next(error);
  } catch (error) {
    return next(error);
  }
})

router.get("/get_weather/:activity_id", async(req: express.Request, res: express.Response, next: express.NextFunction)=>{
  try {
    if(!isValidObjectId(req.params.activity_id)) return next(error_handling_services({error_type: errorTypes.invalidValue, value: "activity id"}));
    const activityFetch = await activityModel.findById(req.params.activity_id).select("city");

    if(activityFetch == null) return next(error_handling_services({error_type: errorTypes.dataNotFound, value:"activity"}));    
    const fetchResult = await RequestService.instance.getWeatherOfWeekRequest(activityFetch.city as string);
    if(fetchResult.success != undefined && !fetchResult.success){
      return next(error_handling_services({error_type: errorTypes.invalidValue, value: "city"}));
    }
    return res.send(fetchResult);
  } catch (error) {
    return next(error);
  }
})

export default router;