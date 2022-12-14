"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.__esModule = true;
exports.createApi = void 0;
var util_1 = require("../util");
var routes_1 = require("../server/routes");
var cache = (0, util_1.memoizeTemporarily)(1000);
var createApi = function (serverUrl) {
    var _a, _b;
    var participantCode = (_a = localStorage.getItem('participantCode')) !== null && _a !== void 0 ? _a : '';
    var sessionUuid = (_b = sessionStorage.getItem('sessionUuid')) !== null && _b !== void 0 ? _b : '';
    var sessionPromise;
    var headers = function () { return ({
        'Content-Type': 'application/json',
        'X-Participant-Code': participantCode,
        'X-Session-UUID': sessionUuid
    }); };
    var verb = (0, util_1.makeApiVerbCreator)(serverUrl);
    var post = verb('POST');
    var get = verb('GET');
    var getConfigCached = cache(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, get(routes_1.getParticipantConfig, {}, headers())];
    }); }); });
    return {
        createSession: function () {
            return __awaiter(this, void 0, void 0, function () {
                var p;
                return __generator(this, function (_a) {
                    if (sessionPromise) {
                        return [2 /*return*/, sessionPromise];
                    }
                    p = post(routes_1.postCreateSession, {}, headers());
                    sessionPromise = p;
                    p.then(function () {
                        sessionPromise = undefined;
                    })["catch"](console.error);
                    return [2 /*return*/, p];
                });
            });
        },
        checkParticipantCode: function (code) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, post(routes_1.postCheckParticipantCode, { code: code }, headers())];
                        case 1:
                            result = _a.sent();
                            if (result.kind !== 'Success') {
                                return [2 /*return*/, false];
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        },
        setAuth: function (code) {
            localStorage.setItem('participantCode', code);
            participantCode = code;
        },
        newSession: function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!participantCode) {
                                console.error('Missing participant code');
                                return [2 /*return*/, false];
                            }
                            console.log('Creating new session');
                            return [4 /*yield*/, this.createSession()];
                        case 1:
                            res = _a.sent();
                            if (res.kind === 'Success') {
                                sessionUuid = res.value.uuid;
                                sessionStorage.setItem('sessionUuid', sessionUuid);
                                console.log('New session', sessionUuid);
                                return [2 /*return*/, true];
                            }
                            console.error('Failed to create session:', res.message);
                            return [2 /*return*/, false];
                    }
                });
            });
        },
        getSession: function () {
            return sessionUuid === '' ? undefined : sessionUuid;
        },
        getConfig: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, getConfigCached(undefined)];
                });
            });
        },
        ensureSession: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (sessionUuid !== '') {
                                return [2 /*return*/];
                            }
                            if (!sessionPromise) return [3 /*break*/, 2];
                            return [4 /*yield*/, sessionPromise];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                        case 2: return [4 /*yield*/, this.newSession()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        postEvent: function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ensureSession()];
                        case 1:
                            _a.sent();
                            event.sessionUuid = sessionUuid;
                            return [4 /*yield*/, post(routes_1.postEvent, event, headers())];
                        case 2:
                            res = _a.sent();
                            if (res.kind === 'Success') {
                                return [2 /*return*/, true];
                            }
                            console.error('Failed to post event:', res.message);
                            return [2 /*return*/, false];
                    }
                });
            });
        },
        logout: function () {
            localStorage.removeItem('participantCode');
            sessionStorage.removeItem('sessionUuid');
            participantCode = '';
            sessionUuid = '';
        }
    };
};
exports.createApi = createApi;
