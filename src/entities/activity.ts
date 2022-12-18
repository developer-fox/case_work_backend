
import mongoose from 'mongoose';
import joi from 'joi';

// interface for activity schema
interface IActivity{
  title: String,
  date: Date,
  description: String,
  category: String,
  city: String,
  venue: String
}

// interface for activity joi schema
// joi is a useful library of data validation
interface IActivityJoiSchema{
  title: string,
  date: Date,
  venue: string
  city: string,
  description: string,
  category: string,
}

// joi schema
const activityJoiSchema = joi.object<IActivityJoiSchema>({
  title: joi.string().required(),
  date: joi.date().required(),
  venue: joi.string().required(),
  city: joi.string().required(),
  description: joi.string().required(),
  category: joi.string().required(),
});

const activitySchema = new mongoose.Schema<IActivity>({
  "category": {type: String, required: true},
  "city": {type: String, required: true},
  "venue": {type: String, required: true},
  "title": {type: String, required: true},
  "description": {type: String, required: true},
  "date": {type: Date, required: true},
});

const activityModel = mongoose.model<IActivity>("activity",activitySchema,"activities");

export {activityModel, activitySchema, activityJoiSchema, IActivity};