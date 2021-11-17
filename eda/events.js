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
exports.EventFactory = exports.newEventFactory = exports.FullEvent = void 0;
var uuid_1 = require("uuid");
exports.FullEvent = {
    fromEvent: function (props) {
        var id = props.id || (0, uuid_1.v4)();
        return __assign(__assign({}, props.event), { meta: {
                id: id,
                createdAt: props.createdAt || new Date(),
                userId: props.userId,
                rootTransactionId: props.rootTransactionId || id
            } });
    },
    fromParentEvent: function (props) {
        return __assign(__assign({}, props.event), { meta: {
                id: props.id || (0, uuid_1.v4)(),
                createdAt: props.createdAt || new Date(),
                userId: props.parentEvent.meta.userId,
                rootTransactionId: props.parentEvent.meta.rootTransactionId
            } });
    },
    fromCmdOrQuery: function (props) {
        var id = props.id || (0, uuid_1.v4)();
        return __assign(__assign({}, props.event), { meta: {
                id: id,
                createdAt: props.createdAt || new Date(),
                userId: props.meta.userId,
                rootTransactionId: props.meta.transactionId || id
            } });
    },
    mapEventsFromCmdOrQuery: function (meta) { return function (events) {
        return events.map(function (event) { return exports.FullEvent.fromCmdOrQuery({ event: event, meta: meta }); });
    }; }
};
var newEventFactory = function (type, version) {
    return {
        new: function (data) {
            return {
                type: type,
                data: data,
                version: version
            };
        },
        type: type,
        version: version,
        is: function (e) {
            return e.type === type;
        },
        isFull: function (e) {
            return e.type === type;
        }
    };
};
exports.newEventFactory = newEventFactory;
exports.EventFactory = {
    new: exports.newEventFactory
};
