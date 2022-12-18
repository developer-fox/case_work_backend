"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userJoiSchema = exports.userSchema = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const userJoiSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
});
exports.userJoiSchema = userJoiSchema;
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    "activities": { type: [mongoose_1.default.SchemaTypes.ObjectId], ref: "activity", default: [] },
});
exports.userSchema = userSchema;
const userModel = mongoose_1.default.model("user", userSchema, "users");
exports.userModel = userModel;
