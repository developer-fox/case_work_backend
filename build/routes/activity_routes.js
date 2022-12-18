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
const mongoose_1 = require("mongoose");
const activity_1 = require("../entities/activity");
const user_1 = require("../entities/user");
const error_types_1 = require("../models/error_types");
const error_handling_services_1 = require("../services/error_handling_services");
const request_service_1 = require("../services/request_service");
const router = express_1.default.Router();
router.put("/create_activity", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { error, value } = activity_1.activityJoiSchema.validate({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            venue: req.body.venue,
            category: req.body.category,
            city: req.body.city,
        });
        if (error == undefined) {
            const newActivity = new activity_1.activityModel({
                "category": value.category,
                "city": value.city,
                "date": value.date,
                "description": value.description,
                "title": value.title,
                "venue": value.venue,
            });
            yield newActivity.save();
            yield user_1.userModel.findByIdAndUpdate((_a = req.decoded) === null || _a === void 0 ? void 0 : _a.id, { $addToSet: { "activities": newActivity._id } });
            return res.send({ result: error_types_1.errorTypes.successfuly });
        }
        return next(error);
    }
    catch (error) {
        return next(error);
    }
}));
router.get("/get_activities", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const fetchResult = yield user_1.userModel.findById((_b = req.decoded) === null || _b === void 0 ? void 0 : _b.id).select("activities").populate("activities");
        return res.send(fetchResult === null || fetchResult === void 0 ? void 0 : fetchResult.activities.reverse());
    }
    catch (error) {
        return next(error);
    }
}));
router.delete("/delete_activity/:activity_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        if (!(0, mongoose_1.isValidObjectId)(req.params.activity_id))
            return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.invalidValue, value: "activity id" }));
        const fetchResult = yield user_1.userModel.findOne({ "activities": req.params.activity_id });
        if (fetchResult != null) {
            if ((fetchResult === null || fetchResult === void 0 ? void 0 : fetchResult.id) != ((_c = req.decoded) === null || _c === void 0 ? void 0 : _c.id))
                return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.authorizationError, value: "action denied" }));
            yield activity_1.activityModel.findByIdAndDelete(req.params.activity_id);
            yield fetchResult.updateOne({
                $pull: {
                    activities: req.params.activity_id
                }
            });
            return res.send({ result: error_types_1.errorTypes.successfuly });
        }
        return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.dataNotFound, value: "activity" }));
    }
    catch (error) {
        return next(error);
    }
}));
router.post("/update_activity/:activity_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, mongoose_1.isValidObjectId)(req.params.activity_id))
            return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.invalidValue, value: "activity id" }));
        const { error, value } = activity_1.activityJoiSchema.validate({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            venue: req.body.venue,
            category: req.body.category,
            city: req.body.city,
        });
        if (error == undefined) {
            yield activity_1.activityModel.findByIdAndUpdate(req.params.activity_id, {
                $set: {
                    "category": value.category,
                    "city": value.city,
                    "date": value.date.setHours(value.date.getHours() + 3),
                    "description": value.description,
                    "title": value.title,
                    "venue": value.venue,
                }
            });
            return res.send({ result: error_types_1.errorTypes.successfuly });
        }
        return next(error);
    }
    catch (error) {
        return next(error);
    }
}));
router.get("/get_weather/:activity_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, mongoose_1.isValidObjectId)(req.params.activity_id))
            return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.invalidValue, value: "activity id" }));
        const activityFetch = yield activity_1.activityModel.findById(req.params.activity_id).select("city");
        if (activityFetch == null)
            return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.dataNotFound, value: "activity" }));
        const fetchResult = yield request_service_1.RequestService.instance.getWeatherOfWeekRequest(activityFetch.city);
        if (fetchResult.success != undefined && !fetchResult.success) {
            return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.invalidValue, value: "city" }));
        }
        return res.send(fetchResult);
    }
    catch (error) {
        return next(error);
    }
}));
exports.default = router;
