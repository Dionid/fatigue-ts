"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCountToNumber = exports.mapCount = exports.selectQuery = exports.countMoreThanZero = exports.countToNumber = void 0;
var functional_oriented_programming_ts_1 = require("functional-oriented-programming-ts");
var countToNumber = function (count) {
    return count ? +count : 0;
};
exports.countToNumber = countToNumber;
var countMoreThanZero = function (count) {
    return !!count && +count > 0;
};
exports.countMoreThanZero = countMoreThanZero;
var selectQuery = function (q) {
    return q.select();
};
exports.selectQuery = selectQuery;
var mapCount = function (result) {
    return result[0].count;
};
exports.mapCount = mapCount;
exports.mapCountToNumber = (0, functional_oriented_programming_ts_1.pipe)(exports.mapCount, exports.countToNumber);
