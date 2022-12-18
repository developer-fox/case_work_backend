import express from 'express';
import { uploadImageToS3 } from '../services/file_service';

const router = express.Router();

router.put("/add_image/:name", uploadImageToS3, (req: express.Request, res: express.Response, next: express.NextFunction)=>{
  return res.send({result: "successfuly"});
});

export default router;
