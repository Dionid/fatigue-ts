"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvOrThrow = void 0;
var errors_1 = require("../errors");
var getEnvOrThrow = function (log) {
    return function (envName) {
        var value = process.env[envName];
        if (!value) {
            var err = new errors_1.InternalError("Env variable '" + envName + "' is required");
            if (log) {
                log(err);
            }
            throw err;
        }
        return value;
    };
};
exports.getEnvOrThrow = getEnvOrThrow;
