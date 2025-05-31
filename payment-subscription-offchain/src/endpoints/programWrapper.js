"use strict";
// yourSDK.ts
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = createService;
exports.updateService = updateService;
exports.removeService = removeService;
exports.createAccount = createAccount;
exports.updateAccount = updateAccount;
exports.removeAccount = removeAccount;
exports.initiateSubscription = initiateSubscription;
exports.BatchSub = BatchSub;
exports.extendSubscription = extendSubscription;
exports.merchantWithdraw = merchantWithdraw;
exports.unsubscribe = unsubscribe;
exports.merchantPenaltyWithdraw = merchantPenaltyWithdraw;
exports.subscriberWithdraw = subscriberWithdraw;
var effect_1 = require("effect");
var createService_js_1 = require("./createService.js");
var updateService_js_1 = require("./updateService.js");
var removeService_js_1 = require("./removeService.js");
var createAccount_js_1 = require("./createAccount.js");
var updateAccount_js_1 = require("./updateAccount.js");
var removeAccount_js_1 = require("./removeAccount.js");
var initiateSubscription_js_1 = require("./initiateSubscription.js");
var batchService_js_1 = require("./batchService.js");
var extendSubscription_js_1 = require("./extendSubscription.js");
var merchantWithdraw_js_1 = require("./merchantWithdraw.js");
var merchantPenaltyWithdraw_js_1 = require("./merchantPenaltyWithdraw.js");
var subscriberWithdraw_js_1 = require("./subscriberWithdraw.js");
var unsubscribe_js_1 = require("./unsubscribe.js");
function createService(lucid, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, effect_1.Effect.runPromise((0, createService_js_1.createServiceProgram)(lucid, config))];
        });
    });
}
function updateService(lucid, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, effect_1.Effect.runPromise((0, updateService_js_1.updateServiceProgram)(lucid, config))];
        });
    });
}
function removeService(lucid, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, effect_1.Effect.runPromise((0, removeService_js_1.removeServiceProgram)(lucid, config))];
        });
    });
}
function createAccount(lucid, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, effect_1.Effect.runPromise((0, createAccount_js_1.createAccountProgram)(lucid, config))];
        });
    });
}
function updateAccount(lucid, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, effect_1.Effect.runPromise((0, updateAccount_js_1.updateAccountProgram)(lucid, config))];
        });
    });
}
function removeAccount(lucid, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, effect_1.Effect.runPromise((0, removeAccount_js_1.removeAccountProgram)(lucid, config))];
        });
    });
}
function initiateSubscription(lucid, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, effect_1.Effect.runPromise((0, initiateSubscription_js_1.initSubscriptionProgram)(lucid, config))];
        });
    });
}
function BatchSub(lucid, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, effect_1.Effect.runPromise((0, batchService_js_1.BatchServiceProgram)(lucid, config))];
        });
    });
}
function extendSubscription(lucid, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, effect_1.Effect.runPromise((0, extendSubscription_js_1.extendSubscriptionProgram)(lucid, config))];
        });
    });
}
function merchantWithdraw(lucid, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, effect_1.Effect.runPromise((0, merchantWithdraw_js_1.merchantWithdrawProgram)(lucid, config))];
        });
    });
}
function unsubscribe(lucid, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, effect_1.Effect.runPromise((0, unsubscribe_js_1.unsubscribeProgram)(lucid, config))];
        });
    });
}
function merchantPenaltyWithdraw(lucid, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, effect_1.Effect.runPromise((0, merchantPenaltyWithdraw_js_1.merchantPenaltyWithdrawProgram)(lucid, config))];
        });
    });
}
function subscriberWithdraw(lucid, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, effect_1.Effect.runPromise((0, subscriberWithdraw_js_1.subscriberWithdrawProgram)(lucid, config))];
        });
    });
}
