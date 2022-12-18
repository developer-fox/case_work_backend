import multer, { FileFilterCallback } from 'multer'
import multer_s3 from "multer-s3";
import environment from "../config/environment";
import { S3Client } from '@aws-sdk/client-s3';
import express from "express";


// aws s3 configuration for s3 actions
const s3 = new S3Client({
  "region": "eu-west-3",  
  credentials: {
    "accessKeyId": environment.aws_access_key_id,
    "secretAccessKey": environment.aws_secret_access_key,
  },
});

/// With this method we can filter the sent files.
const fileFilter = (req: any, file: Express.Multer.File, cb: FileFilterCallback): void =>{
  if(!file) return cb(new Error("images not found"));
  const doctype = file.originalname.split(new RegExp("\.([^.]*)$"))[1];
  const supportedTypes = ["jpg","jpeg","png","PNG"];
  if(supportedTypes.includes(doctype)){
    return cb(null,true);
  }
  let typeError = new Error("***-/-/unsupported file type: " + doctype);
  return cb(typeError);
}

/// middleware to upload city photos to s3 bucket
const uploadImageToS3 = multer({
  storage: multer_s3({
    s3: s3,
    bucket: environment.bucket_name,
    contentType: multer_s3.AUTO_CONTENT_TYPE,
    key: function(req: express.Request, file, cb) {
      try {
        const filename = req.params.name +"."+ file.originalname.split(".")[file.originalname.split(".").length -1]
        const path = `city_photos/${filename}`;
      	return cb(null,path);
      } catch (error) {
        return cb(error);
      }
    }
  }),
  fileFilter: fileFilter,
}).single("image");

export {uploadImageToS3}
