"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knexSnakeCaseMappers = void 0;
// Super fast memoize for single argument functions.
function memoize(func) {
    var cache = new Map();
    return function (input) {
        var output = cache.get(input);
        if (output === undefined) {
            output = func(input);
            cache.set(input, output);
        }
        return output;
    };
}
function isDigit(char) {
    return char >= '0' && char <= '9';
}
function isAllUpperCaseSnakeCase(str) {
    for (var i = 1, l = str.length; i < l; ++i) {
        var char = str[i];
        if (char !== '_' && char !== char.toUpperCase()) {
            return false;
        }
    }
    return true;
}
// camelCase to snake_case converter that also works with non-ascii characters
// This is needed especially so that aliases containing the `:` character,
// objection uses internally, work.
function snakeCase(str, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.upperCase, upperCase = _c === void 0 ? false : _c, _d = _b.underscoreBeforeDigits, underscoreBeforeDigits = _d === void 0 ? false : _d, _e = _b.underscoreBetweenUppercaseLetters, underscoreBetweenUppercaseLetters = _e === void 0 ? false : _e;
    if (str.length === 0) {
        return str;
    }
    var upper = str.toUpperCase();
    var lower = str.toLowerCase();
    var out = lower[0];
    for (var i = 1, l = str.length; i < l; ++i) {
        var char = str[i];
        var prevChar = str[i - 1];
        var upperChar = upper[i];
        var prevUpperChar = upper[i - 1];
        var lowerChar = lower[i];
        var prevLowerChar = lower[i - 1];
        // If underScoreBeforeDigits is true then, well, insert an underscore
        // before digits :). Only the first digit gets an underscore if
        // there are multiple.
        if (underscoreBeforeDigits && isDigit(char) && !isDigit(prevChar)) {
            out += '_' + char;
            continue;
        }
        // Test if `char` is an upper-case character and that the character
        // actually has different upper and lower case versions.
        if (char === upperChar && upperChar !== lowerChar) {
            var prevCharacterIsUppercase = prevChar === prevUpperChar && prevUpperChar !== prevLowerChar;
            // If underscoreBetweenUppercaseLetters is true, we always place an underscore
            // before consecutive uppercase letters (e.g. "fooBAR" becomes "foo_b_a_r").
            // Otherwise, we don't (e.g. "fooBAR" becomes "foo_bar").
            if (underscoreBetweenUppercaseLetters || !prevCharacterIsUppercase) {
                out += '_' + lowerChar;
            }
            else {
                out += lowerChar;
            }
        }
        else {
            out += char;
        }
    }
    if (upperCase) {
        return out.toUpperCase();
    }
    else {
        return out;
    }
}
// snake_case to camelCase converter that simply reverses
// the actions done by `snakeCase` function.
function camelCase(str, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.upperCase, upperCase = _c === void 0 ? false : _c;
    if (str.length === 0) {
        return str;
    }
    if (upperCase && isAllUpperCaseSnakeCase(str)) {
        // Only convert to lower case if the string is all upper
        // case snake_case. This allowes camelCase strings to go
        // through without changing.
        str = str.toLowerCase();
    }
    var out = str[0];
    for (var i = 1, l = str.length; i < l; ++i) {
        var char = str[i];
        var prevChar = str[i - 1];
        if (char !== '_') {
            if (prevChar === '_') {
                out += char.toUpperCase();
            }
            else {
                out += char;
            }
        }
    }
    return out;
}
// Returns a function that splits the inputs string into pieces using `separator`,
// only calls `mapper` for the last part and concatenates the string back together.
// If no separators are found, `mapper` is called for the entire string.
function mapLastPart(mapper, separator) {
    return function (str) {
        var idx = str.lastIndexOf(separator);
        var mapped = mapper(str.slice(idx + separator.length));
        return str.slice(0, idx + separator.length) + mapped;
    };
}
// Returns a function that takes an object as an input and maps the object's keys
// using `mapper`. If the input is not an object, the input is returned unchanged.
function keyMapper(mapper) {
    return function (obj) {
        if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
            return obj;
        }
        var keys = Object.keys(obj);
        var out = {};
        for (var i = 0, l = keys.length; i < l; ++i) {
            var key = keys[i];
            out[mapper(key)] = obj[key];
        }
        return out;
    };
}
function knexIdentifierMappers(_a) {
    var parse = _a.parse, format = _a.format, _b = _a.idSeparator, idSeparator = _b === void 0 ? ':' : _b;
    var formatId = memoize(mapLastPart(format, idSeparator));
    var parseId = memoize(mapLastPart(parse, idSeparator));
    var parseKeys = keyMapper(parseId);
    return {
        wrapIdentifier: function (identifier, origWrap) {
            return origWrap(formatId(identifier));
        },
        postProcessResponse: function (result) {
            if (Array.isArray(result)) {
                var output = new Array(result.length);
                for (var i = 0, l = result.length; i < l; ++i) {
                    output[i] = parseKeys(result[i]);
                }
                return output;
            }
            else {
                return parseKeys(result);
            }
        }
    };
}
function knexSnakeCaseMappers(opt) {
    if (opt === void 0) { opt = {}; }
    return knexIdentifierMappers({
        format: function (str) { return snakeCase(str, opt); },
        parse: function (str) { return camelCase(str, opt); }
    });
}
exports.knexSnakeCaseMappers = knexSnakeCaseMappers;
