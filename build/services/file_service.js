"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToS3 = void 0;
const aws = __importStar(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const environment_1 = __importDefault(require("../config/environment"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Config = new aws.S3({
    credentials: {
        "accessKeyId": environment_1.default.aws_access_key_id,
        "secretAccessKey": environment_1.default.aws_secret_access_key,
    },
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
});
const s3 = new client_s3_1.S3Client({
    "region": "eu-west-3",
    credentials: {
        "accessKeyId": environment_1.default.aws_access_key_id,
        "secretAccessKey": environment_1.default.aws_secret_access_key,
    },
});
const fileFilter = (req, file, cb) => {
    if (!file)
        return cb(new Error("images not found"));
    const doctype = file.originalname.split(new RegExp("\.([^.]*)$"))[1];
    const supportedTypes = ["jpg", "jpeg", "png", "PNG"];
    if (supportedTypes.includes(doctype)) {
        return cb(null, true);
    }
    let typeError = new Error("***-/-/unsupported file type: " + doctype);
    return cb(typeError);
};
const uploadImageToS3 = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: "weatherapp-case-work-bucket",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            try {
                const filename = req.params.name + "." + file.originalname.split(".")[file.originalname.split(".").length - 1];
                const path = `city_photos/${filename}`;
                return cb(null, path);
            }
            catch (error) {
                return cb(error);
            }
        }
    }),
    fileFilter: fileFilter,
}).single("image");
exports.uploadImageToS3 = uploadImageToS3;
