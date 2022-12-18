"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error_handling_services = exports.CustomApiError = void 0;
const error_types_1 = require("../models/error_types");
class CustomApiError {
    constructor(error_value, error_type) {
        this.error_type = error_type;
        this.error_value = error_value;
        this.status_code = statusCodeLoader(error_type);
    }
    ;
}
exports.CustomApiError = CustomApiError;
const error_handling_services = function ({ error_type, value }) {
    let errorMessage = {
        [error_types_1.errorTypes.invalidValue]: `invalid value: ${value}`,
        [error_types_1.errorTypes.dataNotFound]: `data not found: ${value}`,
        [error_types_1.errorTypes.logicalError]: `logical error: ${value}`,
        [error_types_1.errorTypes.authorizationError]: `authorization error at: ${value}`,
        [error_types_1.errorTypes.expiredRefreshToken]: `jwt refresh token expired so login required.`,
        [error_types_1.errorTypes.jwtError]: `authentication required(with json web token)`,
        [error_types_1.errorTypes.successfuly]: `successfuly`,
    };
    return new CustomApiError(value !== null && value !== void 0 ? value : error_type.toString(), error_type);
};
exports.error_handling_services = error_handling_services;
function statusCodeLoader(errorType) {
    switch (errorType) {
        case error_types_1.errorTypes.authorizationError:
            return 401;
        case error_types_1.errorTypes.dataNotFound:
            return 444;
        case error_types_1.errorTypes.expiredRefreshToken:
            return 407;
        case error_types_1.errorTypes.invalidValue:
            return 400;
        case error_types_1.errorTypes.jwtError:
            return 412;
        case error_types_1.errorTypes.logicalError:
            return 416;
        case error_types_1.errorTypes.successfuly:
            return 200;
        default:
            return 200;
    }
}
