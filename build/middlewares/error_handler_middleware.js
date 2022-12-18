"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const error_handling_services_1 = require("../services/error_handling_services");
function default_1(err, req, res, next) {
    if (err instanceof joi_1.default.ValidationError) {
        return res.status(422).send(err.details);
    }
    else if (err instanceof error_handling_services_1.CustomApiError) {
        return res.status(err.status_code).send({
            error_type: err.error_type,
            description: err.error_value
        });
    }
    else {
        if (err instanceof Error) {
            if (err.message.split(":")[0] == "***-/-/unsupported file type") {
                return res.status(400).send(`unsupported file type:${err.message.split(":")[1]}`);
            }
            else {
                console.log(err);
                return res.status(500).send("an error occured on server");
            }
        }
    }
}
exports.default = default_1;
