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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBusInMemoryService = exports.EventBusInMemory = exports.observeC = exports.observe = exports.pullC = exports.pull = exports.rollback = exports.commit = exports.tx = exports.publishC = exports.publish = exports.subscribeC = exports.subscribe = exports.unsubscribeC = exports.unsubscribe = exports.create = void 0;
var functional_oriented_programming_ts_1 = require("functional-oriented-programming-ts");
var create = function (props) {
    if (props === void 0) { props = {}; }
    return {
        tx: props.tx || false,
        onError: props.onError ||
            (function (e) {
                throw e;
            }),
        storedEvents: props.storedEvents || [],
        eventHandlers: props.eventHandlers || {},
        persistor: props.persistor,
        log: props.log
    };
};
exports.create = create;
var unsubscribe = function (ebps, eventName, eventHandler) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (ebps.eventHandlers[eventName]) {
            ebps.eventHandlers[eventName] = ebps.eventHandlers[eventName].filter(function (c) { return c === eventHandler; });
        }
        return [2 /*return*/, ebps];
    });
}); };
exports.unsubscribe = unsubscribe;
var unsubscribeC = function (eventName, eventHandler) {
    return function (ebps) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, exports.unsubscribe)(ebps, eventName, eventHandler)];
        });
    }); };
};
exports.unsubscribeC = unsubscribeC;
var subscribe = function (ebps, eventName, eventHandler) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (ebps.eventHandlers[eventName]) {
            ebps.eventHandlers[eventName].push(eventHandler);
        }
        else {
            ebps.eventHandlers[eventName] = [eventHandler];
        }
        return [2 /*return*/, __assign(__assign({}, ebps), { eventHandlers: __assign({}, ebps.eventHandlers) })];
    });
}); };
exports.subscribe = subscribe;
var subscribeC = function (eventName, eventHandler) {
    return function (ebps) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, exports.subscribe)(ebps, eventName, eventHandler)];
        });
    }); };
};
exports.subscribeC = subscribeC;
var dispatch = function (events) { return function (ebps) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, events.map(function (event) { return __awaiter(void 0, void 0, void 0, function () {
                    var handlers, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                handlers = ebps.eventHandlers[event.type];
                                if (!ebps.persistor) return [3 /*break*/, 4];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, ebps.persistor.saveEvent(event)];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _a.sent();
                                ebps.onError(e_1);
                                return [3 /*break*/, 4];
                            case 4:
                                if (!handlers) return [3 /*break*/, 6];
                                return [4 /*yield*/, handlers.map(function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                                        var e_2;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    return [4 /*yield*/, callback(event)];
                                                case 1:
                                                    _a.sent();
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    e_2 = _a.sent();
                                                    ebps.onError(e_2);
                                                    return [3 /*break*/, 3];
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                            case 5:
                                _a.sent();
                                _a.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }; };
var publish = function (ebps, events) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (ebps.tx) {
                    (_a = ebps.storedEvents).push.apply(_a, events);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, dispatch(events)(ebps)];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.publish = publish;
var publishC = function (events) {
    return function (ebps) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, exports.publish)(ebps, events)];
        });
    }); };
};
exports.publishC = publishC;
var tx = function (ebps) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, __assign(__assign({}, ebps), { tx: true, storedEvents: [] })];
    });
}); };
exports.tx = tx;
var commit = function (ebps) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ebps.tx) {
                    return [2 /*return*/, ebps];
                }
                return [4 /*yield*/, dispatch(ebps.storedEvents)(ebps)];
            case 1:
                _a.sent();
                return [2 /*return*/, __assign(__assign({}, ebps), { tx: false, storedEvents: [] })];
        }
    });
}); };
exports.commit = commit;
var rollback = function (ebps) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!ebps.tx) {
            return [2 /*return*/, ebps];
        }
        return [2 /*return*/, __assign(__assign({}, ebps), { tx: false, storedEvents: [] })];
    });
}); };
exports.rollback = rollback;
var pull = function (ebps, eventName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                var callback = function (event) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                resolve(event);
                                return [4 /*yield*/, (0, exports.unsubscribe)(ebps, eventName, callback)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                (0, exports.subscribe)(ebps, eventName, callback);
            })];
    });
}); };
exports.pull = pull;
var pullC = function (eventName) {
    return function (ebps) {
        return (0, exports.pull)(ebps, eventName);
    };
};
exports.pullC = pullC;
function observe(ebps, eventName) {
    return __asyncGenerator(this, arguments, function observe_1() {
        var stop, deff, callback, event;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stop = false;
                    deff = functional_oriented_programming_ts_1.Deferred.new();
                    callback = function (e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            deff.resolve(e);
                            deff = functional_oriented_programming_ts_1.Deferred.new();
                            return [2 /*return*/];
                        });
                    }); };
                    return [4 /*yield*/, __await((0, exports.subscribe)(ebps, eventName, callback))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!!stop) return [3 /*break*/, 6];
                    return [4 /*yield*/, __await(deff.promise)];
                case 3:
                    event = _a.sent();
                    return [4 /*yield*/, __await({
                            stop: function () {
                                (0, exports.unsubscribe)(ebps, eventName, callback);
                                stop = true;
                            },
                            data: event
                        })];
                case 4: return [4 /*yield*/, _a.sent()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.observe = observe;
var observeC = function (eventName) {
    return function (ebps) {
        return observe(ebps, eventName);
    };
};
exports.observeC = observeC;
exports.EventBusInMemory = {
    create: exports.create,
    unsubscribe: exports.unsubscribe,
    unsubscribeC: exports.unsubscribeC,
    subscribe: exports.subscribe,
    subscribeC: exports.subscribeC,
    publish: exports.publish,
    publishC: exports.publishC,
    pull: exports.pull,
    pullC: exports.pullC,
    observe: observe,
    observeC: exports.observeC,
    tx: exports.tx,
    commit: exports.commit,
    rollback: exports.rollback
};
exports.EventBusInMemoryService = {
    fromEventBusInmemory: function (ebps) {
        return {
            unsubscribe: function (eventName, eventHandler) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = exports.EventBusInMemoryService).create;
                        return [4 /*yield*/, (0, exports.unsubscribe)(ebps, eventName, eventHandler)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            }); }); },
            subscribe: function (eventName, eventHandler) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = exports.EventBusInMemoryService).create;
                        return [4 /*yield*/, (0, exports.subscribe)(ebps, eventName, eventHandler)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            }); }); },
            publish: function (events) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, (0, exports.publish)(ebps, events)];
            }); }); },
            pull: function (eventName) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, (0, exports.pull)(ebps, eventName)];
            }); }); },
            observe: function (eventName) { return observe(ebps, eventName); },
            tx: function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = exports.EventBusInMemoryService).create;
                        return [4 /*yield*/, (0, exports.tx)(ebps)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            }); }); },
            commit: function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = exports.EventBusInMemoryService).create;
                        return [4 /*yield*/, (0, exports.commit)(ebps)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            }); }); },
            rollback: function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = exports.EventBusInMemoryService).create;
                        return [4 /*yield*/, (0, exports.rollback)(ebps)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            }); }); }
        };
    },
    create: function (props) {
        return exports.EventBusInMemoryService.fromEventBusInmemory((0, exports.create)(props));
    }
};
