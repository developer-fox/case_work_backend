"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToS3 = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const environment_1 = __importDefault(require("../config/environment"));
const client_s3_1 = require("@aws-sdk/client-s3");
// aws s3 configuration for s3 actions
const s3 = new client_s3_1.S3Client({
    "region": "eu-west-3",
    credentials: {
        "accessKeyId": environment_1.default.aws_access_key_id,
        "secretAccessKey": environment_1.default.aws_secret_access_key,
    },
});
/// With this method we can filter the sent files.
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
/// middleware to upload city photos to s3 bucket
const uploadImageToS3 = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: environment_1.default.bucket_name,
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
