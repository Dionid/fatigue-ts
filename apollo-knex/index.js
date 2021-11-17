"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCommonSearchParamsToQuery = exports.orderByArgToQuery = exports.offsetArgToQuery = exports.limitArgToQuery = void 0;
var functional_oriented_programming_ts_1 = require("functional-oriented-programming-ts");
var limitArgToQuery = function (args) {
    return function (query) {
        if (args.limit) {
            return query.limit(args.limit);
        }
        return query;
    };
};
exports.limitArgToQuery = limitArgToQuery;
var offsetArgToQuery = function (args) {
    return function (query) {
        if (args.offset) {
            return query.offset(args.offset);
        }
        return query;
    };
};
exports.offsetArgToQuery = offsetArgToQuery;
var orderByArgToQuery = function (args) {
    return function (query) {
        if (args.orderBy) {
            return Object.entries(args.orderBy).reduce(function (reducedQuery, _a) {
                var name = _a[0], val = _a[1];
                if (val) {
                    return reducedQuery.orderBy(name, val);
                }
                return reducedQuery;
            }, query);
        }
        return query;
    };
};
exports.orderByArgToQuery = orderByArgToQuery;
var mapCommonSearchParamsToQuery = function (args) { return (0, functional_oriented_programming_ts_1.pipe)((0, exports.limitArgToQuery)(args), (0, exports.offsetArgToQuery)(args), (0, exports.orderByArgToQuery)(args)); };
exports.mapCommonSearchParamsToQuery = mapCommonSearchParamsToQuery;
