"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorTypes = void 0;
var errorTypes;
(function (errorTypes) {
    errorTypes["invalidValue"] = "invalid value";
    errorTypes["dataNotFound"] = "data not found";
    errorTypes["logicalError"] = "logical error";
    errorTypes["authorizationError"] = "authorization error";
    errorTypes["expiredRefreshToken"] = "expired refresh token";
    errorTypes["jwtError"] = "not found jwt token";
    errorTypes["successfuly"] = "successfuly";
})(errorTypes = exports.errorTypes || (exports.errorTypes = {}));
