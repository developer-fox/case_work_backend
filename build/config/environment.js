"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// load the environment variables
dotenv_1.default.config();
const environment = {
    mongodb_url: process.env.MONGODB_URL,
    jwt_secret: process.env.jwt_secret,
    jwt_refresh_secret: process.env.jwt_refresh_secret,
    collect_api_token: process.env.collect_api_token,
    admin_password: process.env.admin_psw,
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    bucket_name: process.env.bucket_name
};
exports.default = environment;
