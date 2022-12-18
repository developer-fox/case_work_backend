"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const error_handling_services_1 = require("./error_handling_services");
const error_types_1 = require("../models/error_types");
class JwtServices {
    constructor() { }
    static get instance() {
        if (JwtServices._instance == null)
            JwtServices._instance = new JwtServices();
        return this._instance;
    }
    createNewJwtTokenWithRefreshToken(refreshToken) {
        try {
            const validatingRefreshToken = jwt.verify(refreshToken, process.env.jwt_refresh_secret);
            const newToken = jwt.sign({ id: validatingRefreshToken.id }, process.env.jwt_secret, { expiresIn: "1 hour" });
            return newToken;
        }
        catch (error) {
            if (error instanceof Error && error.message == "jwt expired") {
                //TODO: redirecting authentication again
                throw (0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.expiredRefreshToken });
            }
            else {
                throw error;
            }
        }
    }
    validateJwt(req, res, next) {
        const jwtToken = req.headers["x-access-key"];
        const jwtRefreshToken = req.headers["x-access-refresh-key"];
        if (!jwtToken || !jwtRefreshToken) {
            return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.jwtError }));
        }
        // verifying the jwt token
        try {
            const decoded = jwt.verify(jwtToken, process.env.jwt_secret);
            req.decoded = { id: decoded.id };
            res.setHeader("x-access-key", jwtToken);
            return next();
        }
        catch (error) {
            if (error instanceof Error && (error.message == "jwt expired" || error.message == "invalid token")) {
                // creating new jwt token
                try {
                    const newToken = JwtServices.instance.createNewJwtTokenWithRefreshToken(jwtRefreshToken);
                    req.token = newToken;
                    res.setHeader("x-access-key", req.token);
                    req.decoded = { id: jwt.decode(req.token).id };
                    return next();
                }
                catch (error) {
                    return next(error);
                }
            }
            else if (error instanceof Error && error.message == "jwt malformed") {
                return next((0, error_handling_services_1.error_handling_services)({ error_type: error_types_1.errorTypes.jwtError, value: "sended malformed jwt token" }));
            }
            else {
                return next(error);
            }
        }
    }
    createJwtTokens(id) {
        const token = jwt.sign({ id: id }, process.env.jwt_secret, { expiresIn: "1 hour" });
        const refreshToken = jwt.sign({ id: id }, process.env.jwt_refresh_secret, { expiresIn: "1 day" });
        return { jwt_token: token, refresh_token: refreshToken };
    }
}
exports.default = JwtServices;
