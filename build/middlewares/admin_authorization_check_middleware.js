"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("../config/environment"));
const error_types_1 = require("../models/error_types");
const error_handling_services_1 = require("../services/error_handling_services");
/// This middleware checks if there is an admin key in the header and if it is correct. If it exists and is true, it will let the request pass.
function adminAuthorizationCheck(req, res, next) {
    try {
        if (req.headers["admin-key"] != environment_1.default.admin_password)
            return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.authorizationError, value: "action denied" }));
        return next();
    }
    catch (error) {
        return next(error);
    }
}
exports.default = adminAuthorizationCheck;
