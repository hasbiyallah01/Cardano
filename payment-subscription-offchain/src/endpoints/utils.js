"use strict";
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPaymentToWithdraw = exports.findUnsubscribePaymentUTxO = exports.calculateClaimableIntervals = exports.getPenaltyDatum = exports.getPaymentValidatorDatum = exports.getServiceValidatorDatum = exports.logWalletUTxOs = exports.getWalletUTxOs = exports.extractTokens = void 0;
var index_js_1 = require("../../index.js");
var effect_1 = require("effect");
var lucid_1 = require("@lucid-evolution/lucid");
var assets_js_1 = require("../core/utils/assets.js");
var extractTokens = function (policyId, validatorUTxOs, walletUTxOs) {
    var user_token;
    var ref_token;
    if (validatorUTxOs.length > 0 && walletUTxOs.length > 0) {
        var _a = (0, assets_js_1.findCip68TokenNames)(validatorUTxOs, walletUTxOs, policyId), refTokenName = _a.refTokenName, userTokenName = _a.userTokenName;
        ref_token = (0, lucid_1.toUnit)(policyId, refTokenName);
        user_token = (0, lucid_1.toUnit)(policyId, userTokenName);
        return { user_token: user_token, ref_token: ref_token };
    }
    else {
        throw new Error("Failed to find both UTxOs");
    }
};
exports.extractTokens = extractTokens;
var getWalletUTxOs = function (lucid) {
    return effect_1.Effect.gen(function ($) {
        var walletAddr, utxos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [5 /*yield**/, __values($(effect_1.Effect.promise(function () { return lucid.wallet().address(); })))];
                case 1:
                    walletAddr = _a.sent();
                    return [5 /*yield**/, __values($(effect_1.Effect.promise(function () { return lucid.utxosAt(walletAddr); })))];
                case 2:
                    utxos = _a.sent();
                    return [2 /*return*/, utxos];
            }
        });
    });
};
exports.getWalletUTxOs = getWalletUTxOs;
var logWalletUTxOs = function (lucid, msg) {
    return effect_1.Effect.gen(function ($) {
        var utxos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [5 /*yield**/, __values($((0, exports.getWalletUTxOs)(lucid)))];
                case 1:
                    utxos = _a.sent();
                    return [5 /*yield**/, __values($(effect_1.Effect.sync(function () {
                            effect_1.Effect.log("------------------------- ".concat(msg, " -------------------------"));
                            effect_1.Effect.log(utxos);
                        })))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, utxos];
            }
        });
    });
};
exports.logWalletUTxOs = logWalletUTxOs;
var getServiceValidatorDatum = function (utxoOrUtxos) {
    var utxos = Array.isArray(utxoOrUtxos) ? utxoOrUtxos : [utxoOrUtxos];
    return utxos.flatMap(function (utxo, index) {
        if (!utxo.datum) {
            console.error("UTxO ".concat(index, " has no datum."));
            return [];
        }
        try {
            var result = (0, index_js_1.parseSafeDatum)(utxo.datum, index_js_1.ServiceDatum);
            if (result.type == "right") {
                return [result.value];
            }
            else {
                console.error("Failed to parse datum for UTxO ".concat(index, ":"), result.type);
                return [];
            }
        }
        catch (error) {
            console.error("Exception while parsing datum for UTxO ".concat(index, ":"), error);
            return [];
        }
    });
};
exports.getServiceValidatorDatum = getServiceValidatorDatum;
var getPaymentValidatorDatum = function (utxoOrUtxos) {
    var utxos = Array.isArray(utxoOrUtxos) ? utxoOrUtxos : [utxoOrUtxos];
    return utxos.flatMap(function (utxo) {
        var result = (0, index_js_1.parseSafeDatum)(utxo.datum, index_js_1.PaymentValidatorDatum);
        if (result.type == "right") {
            var paymentValidatorDatum = result.value;
            if ("Payment" in paymentValidatorDatum) {
                var paymentDatum = paymentValidatorDatum.Payment[0];
                return [paymentDatum];
            }
            else {
                console.error("UTxO ".concat(utxo.txHash, " contains Penalty datum, skipping."));
                return [];
            }
        }
        else {
            return [];
        }
    });
};
exports.getPaymentValidatorDatum = getPaymentValidatorDatum;
var getPenaltyDatum = function (utxoOrUtxos) {
    var utxos = Array.isArray(utxoOrUtxos) ? utxoOrUtxos : [utxoOrUtxos];
    return utxos.flatMap(function (utxo) {
        var result = (0, index_js_1.parseSafeDatum)(utxo.datum, index_js_1.PaymentValidatorDatum);
        if (result.type == "right") {
            var paymentValidatorDatum = result.value;
            // Check if it's a Payment or Penalty
            if ("Penalty" in paymentValidatorDatum) {
                var penaltyDatum = paymentValidatorDatum.Penalty[0];
                return [penaltyDatum];
            }
            else {
                console.error("UTxO ".concat(utxo.txHash, " contains Payment datum, skipping."));
                return [];
            }
        }
        else {
            return [];
        }
    });
};
exports.getPenaltyDatum = getPenaltyDatum;
var calculateClaimableIntervals = function (currentTime, paymentData) {
    var index = paymentData.installments.findIndex(function (i) { return i.claimable_at > currentTime; });
    if (index == 0) {
        throw new Error("No installment withdrawable");
    }
    var withdrawableCount = index > 0 ? index : paymentData.installments.length;
    var newInstallments = Array.from(paymentData.installments);
    var withdrawn = newInstallments.splice(0, withdrawableCount);
    var withdrawableAmount = withdrawn.reduce(function (acc, i) { return acc + i.claimable_amount; }, 0n);
    return {
        withdrawableAmount: withdrawableAmount,
        withdrawableCount: withdrawableCount,
        newInstallments: newInstallments,
    };
};
exports.calculateClaimableIntervals = calculateClaimableIntervals;
var findUnsubscribePaymentUTxO = function (paymentUTxOs, serviceNftTn, subscriberNftTn) {
    return effect_1.Effect.gen(function () {
        var results, paymentUTxO;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Starting search for UTxO with:");
                    console.log("  - Service NFT:", serviceNftTn);
                    console.log("  - Subscriber NFT:", subscriberNftTn);
                    results = paymentUTxOs.map(function (utxo) {
                        try {
                            var datum = (0, exports.getPaymentValidatorDatum)(utxo);
                            var serviceMatch = datum[0].service_nft_tn === serviceNftTn;
                            var subscriberMatch = datum[0].subscriber_nft_tn === subscriberNftTn;
                            console.log("\nChecking UTxO ".concat(utxo.txHash.slice(0, 8), ":"));
                            console.log("  Service NFT matches:", serviceMatch);
                            console.log("  Subscriber NFT matches:", subscriberMatch);
                            if (serviceMatch && subscriberMatch) {
                                console.log("  Found matching UTxO!");
                                return utxo;
                            }
                            return undefined;
                        }
                        catch (error) {
                            console.log("\nError processing UTxO ".concat(utxo.txHash.slice(0, 8), ":"), error);
                            return undefined;
                        }
                    });
                    paymentUTxO = results.find(function (result) { return result !== undefined; });
                    if (!!paymentUTxO) return [3 /*break*/, 2];
                    console.log("\nNo matching UTxO found!");
                    return [5 /*yield**/, __values(effect_1.Effect.fail(new lucid_1.TxBuilderError({
                            cause: "No active subscription found for this subscriber and service",
                        })))];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    console.log("\nFound matching UTxO:", paymentUTxO.txHash);
                    return [2 /*return*/, paymentUTxO];
            }
        });
    });
};
exports.findUnsubscribePaymentUTxO = findUnsubscribePaymentUTxO;
var findPaymentToWithdraw = function (paymentUTxOs, serviceNftTn, subscriber_nft_tn) {
    for (var _i = 0, paymentUTxOs_1 = paymentUTxOs; _i < paymentUTxOs_1.length; _i++) {
        var utxo = paymentUTxOs_1[_i];
        try {
            var paymentDatum = (0, exports.getPaymentValidatorDatum)(utxo)[0];
            if (paymentDatum.service_nft_tn === serviceNftTn &&
                paymentDatum.subscriber_nft_tn === subscriber_nft_tn) {
                return {
                    paymentUTxO: utxo,
                    paymentDatum: paymentDatum,
                };
            }
        }
        catch (_a) {
            continue;
        }
    }
    throw new Error("No payment found for service ".concat(serviceNftTn));
};
exports.findPaymentToWithdraw = findPaymentToWithdraw;
