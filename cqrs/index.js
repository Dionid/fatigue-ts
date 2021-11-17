"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HybridFactory = exports.Hybrid = exports.CommandFactory = exports.Command = exports.QueryFactory = exports.Query = void 0;
var uuid_1 = require("uuid");
exports.Query = {
    new: function (props) {
        return {
            type: props.type,
            data: props.data,
            meta: {
                userId: props.userId,
                transactionId: props.transactionId || (0, uuid_1.v4)(),
                parentTransactionId: props.parentTransactionId,
                createdAt: props.createdAt || new Date()
            }
        };
    }
};
var QueryFactory = function (type) {
    return {
        new: function (data, meta) {
            return exports.Query.new(__assign({ type: type, data: data }, meta));
        },
        type: type
    };
};
exports.QueryFactory = QueryFactory;
exports.Command = {
    new: function (props) {
        return {
            type: props.type,
            data: props.data,
            meta: {
                userId: props.userId,
                transactionId: props.transactionId || (0, uuid_1.v4)(),
                parentTransactionId: props.parentTransactionId,
                createdAt: props.createdAt || new Date()
            }
        };
    }
};
var CommandFactory = function (type) {
    return {
        new: function (data, meta) {
            return exports.Command.new(__assign({ type: type, data: data }, meta));
        },
        type: type
    };
};
exports.CommandFactory = CommandFactory;
exports.Hybrid = {
    new: function (props) {
        return {
            data: props.data,
            type: props.type,
            meta: {
                transactionId: props.transactionId || (0, uuid_1.v4)(),
                userId: props.userId,
                parentTransactionId: props.parentTransactionId,
                createdAt: props.createdAt || new Date()
            }
        };
    }
};
var HybridFactory = function (type) {
    return {
        new: function (data, meta) {
            return exports.Hybrid.new(__assign({ type: type, data: data }, meta));
        },
        type: type
    };
};
exports.HybridFactory = HybridFactory;
