"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_service_1 = require("../services/file_service");
const router = express_1.default.Router();
router.put("/add_image/:name", file_service_1.uploadImageToS3, (req, res, next) => {
    return res.send({ result: "successfuly" });
});
exports.default = router;
