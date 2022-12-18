"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityJoiSchema = exports.activitySchema = exports.activityModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const activityJoiSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    date: joi_1.default.date().required(),
    venue: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    category: joi_1.default.string().required(),
});
exports.activityJoiSchema = activityJoiSchema;
const activitySchema = new mongoose_1.default.Schema({
    "category": { type: String, required: true },
    "city": { type: String, required: true },
    "venue": { type: String, required: true },
    "title": { type: String, required: true },
    "description": { type: String, required: true },
    "date": { type: Date, required: true },
});
exports.activitySchema = activitySchema;
const activityModel = mongoose_1.default.model("activity", activitySchema, "activities");
exports.activityModel = activityModel;
