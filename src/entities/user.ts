import mongoose from "mongoose";
import { IActivity} from "./activity";
import joi from 'joi';

interface IUser{
  email: String,
  password: String,
  activities: mongoose.PopulatedDoc<mongoose.Document<mongoose.ObjectId> & IActivity>[],
}

interface IUserJoiSchema{
  email: string,
  password: string,
}

const userJoiSchema = joi.object<IUserJoiSchema>({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const userSchema = new mongoose.Schema<IUser>({
  email: {type: String, required: true},
  password: {type: String, required: true},
  "activities": {type: [mongoose.SchemaTypes.ObjectId], ref: "activity", default: []},
});

const userModel = mongoose.model<IUser>("user", userSchema, "users");

export {userModel, userSchema, userJoiSchema, IUser};
