"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnOnThrow = exports.throwOnErrorC = exports.throwOnError = exports.throwOnUndefined = exports.UnauthorizedError = exports.NotFoundError = exports.PermissionDeniedError = exports.ValidationError = exports.CriticalError = exports.InternalError = exports.PublicError = exports.CodeError = void 0;
var CodeError = /** @class */ (function (_super) {
    __extends(CodeError, _super);
    function CodeError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        return _this;
    }
    return CodeError;
}(Error));
exports.CodeError = CodeError;
// . Accessibility errors
var PublicError = /** @class */ (function (_super) {
    __extends(PublicError, _super);
    function PublicError(publicMessage, internalMessage, code) {
        var _this = _super.call(this, publicMessage, code) || this;
        _this.internalMessage = internalMessage || publicMessage;
        return _this;
    }
    return PublicError;
}(CodeError));
exports.PublicError = PublicError;
var InternalError = /** @class */ (function (_super) {
    __extends(InternalError, _super);
    function InternalError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InternalError;
}(CodeError));
exports.InternalError = InternalError;
// . Status errors
var CriticalError = /** @class */ (function (_super) {
    __extends(CriticalError, _super);
    function CriticalError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CriticalError;
}(InternalError));
exports.CriticalError = CriticalError;
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ValidationError;
}(PublicError));
exports.ValidationError = ValidationError;
var PermissionDeniedError = /** @class */ (function (_super) {
    __extends(PermissionDeniedError, _super);
    function PermissionDeniedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PermissionDeniedError;
}(PublicError));
exports.PermissionDeniedError = PermissionDeniedError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NotFoundError;
}(PublicError));
exports.NotFoundError = NotFoundError;
var UnauthorizedError = /** @class */ (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError() {
        return _super.call(this, 'You must be authorized') || this;
    }
    return UnauthorizedError;
}(PermissionDeniedError));
exports.UnauthorizedError = UnauthorizedError;
var throwOnUndefined = function (error, value) {
    if (value === undefined) {
        throw error;
    }
    return value;
};
exports.throwOnUndefined = throwOnUndefined;
var throwOnError = function (value, fn) {
    if (value instanceof Error) {
        throw fn ? fn(value) : value;
    }
    return value;
};
exports.throwOnError = throwOnError;
var throwOnErrorC = function (fn) {
    return function (value) {
        if (value instanceof Error) {
            throw fn ? fn(value) : value;
        }
        return value;
    };
};
exports.throwOnErrorC = throwOnErrorC;
var returnOnThrow = function (callback) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, callback()];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                e_1 = _a.sent();
                if (!(e_1 instanceof Error)) {
                    throw e_1;
                }
                return [2 /*return*/, e_1];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.returnOnThrow = returnOnThrow;
