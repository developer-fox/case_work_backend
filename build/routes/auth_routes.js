"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../entities/user");
const error_handling_services_1 = require("../services/error_handling_services");
const error_types_1 = require("../models/error_types");
const jwt_services_1 = __importDefault(require("../services/jwt_services"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
router.put("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = user_1.userJoiSchema.validate({
            email: req.body.email,
            password: req.body.password,
        });
        if (error == undefined) {
            const fetchResult = yield user_1.userModel.findOne({ email: value.email });
            if (fetchResult != null)
                return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.logicalError, value: "this is email already using" }));
            const hashedPassword = yield bcrypt_1.default.hash(value.password, 13);
            const newUser = new user_1.userModel({
                "email": value.email,
                "password": hashedPassword,
            });
            yield newUser.save();
            const tokens = jwt_services_1.default.instance.createJwtTokens(newUser.id);
            return res.send({ status: error_types_1.errorTypes.successfuly, tokens });
        }
        return next(error);
    }
    catch (error) {
        if (error instanceof Error)
            return next(error);
    }
}));
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = user_1.userJoiSchema.validate({
            email: req.body.email,
            password: req.body.password,
        });
        if (error == undefined) {
            const user = yield user_1.userModel.findOne({ email: value.email }).select("-activities");
            if (user == null)
                return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.dataNotFound, value: "user not found" }));
            const passwordComparing = yield bcrypt_1.default.compare(value.password, user.password);
            if (!passwordComparing)
                return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.logicalError, value: "wrong password" }));
            const tokens = jwt_services_1.default.instance.createJwtTokens(user.id);
            return res.send(tokens);
        }
        return next(error);
    }
    catch (error) {
        if (error instanceof Error)
            return next(error);
    }
}));
exports.default = router;
