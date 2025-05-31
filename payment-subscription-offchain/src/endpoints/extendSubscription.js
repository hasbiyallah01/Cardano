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
exports.extendSubscriptionProgram = void 0;
var lucid_1 = require("@lucid-evolution/lucid");
var contract_types_js_1 = require("../core/contract.types.js");
var index_js_1 = require("../core/index.js");
var effect_1 = require("effect");
var assets_js_1 = require("../core/utils/assets.js");
var utils_js_1 = require("./utils.js");
var constants_js_1 = require("../core/validators/constants.js");
var extendSubscriptionProgram = function (lucid, config) {
    return effect_1.Effect.gen(function () {
        var subscriberAddress, paymentValidator, serviceNFT, subscriberNFT, serviceUTxO, paymentUTxOs, result, paymentUTxO, oldPaymentDatum, paymentNftTn, paymentNFT, serviceData, serviceDatum, paymentDatum, newTotalSubscriptionFee, allDatums, paymentValDatum, extendRedeemer, tx;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.wallet().address(); }))];
                case 1:
                    subscriberAddress = _c.sent();
                    paymentValidator = (0, index_js_1.getMultiValidator)(lucid, constants_js_1.paymentScript);
                    serviceNFT = (0, lucid_1.toUnit)(constants_js_1.servicePolicyId, config.service_nft_tn);
                    subscriberNFT = (0, lucid_1.toUnit)(constants_js_1.accountPolicyId, config.subscriber_nft_tn);
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxoByUnit(serviceNFT); }))];
                case 2:
                    serviceUTxO = _c.sent();
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxosAt(paymentValidator.spendValAddress); }))];
                case 3:
                    paymentUTxOs = _c.sent();
                    result = paymentUTxOs
                        .flatMap(function (utxo) { return (0, utils_js_1.getPaymentValidatorDatum)(utxo).map(function (datum) { return [utxo, datum]; }); })
                        .find(function (_a) {
                        var _ = _a[0], datum = _a[1];
                        return datum.service_nft_tn === config.service_nft_tn && datum.subscriber_nft_tn === config.subscriber_nft_tn;
                    });
                    if (!result) {
                        throw new Error("No active subscription found");
                    }
                    paymentUTxO = result[0], oldPaymentDatum = result[1];
                    paymentNftTn = (0, assets_js_1.tokenNameFromUTxO)([paymentUTxO], constants_js_1.paymentPolicyId);
                    paymentNFT = (0, lucid_1.toUnit)(constants_js_1.paymentPolicyId, paymentNftTn);
                    serviceData = (0, utils_js_1.getServiceValidatorDatum)(serviceUTxO);
                    if (!serviceData || !serviceData.length) {
                        throw new Error("Service not found");
                    }
                    serviceDatum = serviceData[0];
                    paymentDatum = {
                        service_nft_tn: oldPaymentDatum.service_nft_tn,
                        subscriber_nft_tn: oldPaymentDatum.subscriber_nft_tn,
                        subscription_start: oldPaymentDatum.subscription_start,
                        subscription_end: oldPaymentDatum.subscription_end + (config.extension_intervals * serviceDatum.interval_length),
                        original_subscription_end: oldPaymentDatum.original_subscription_end,
                        installments: oldPaymentDatum.installments.concat(Array.from({ length: Number(config.extension_intervals) }, function (_, i) {
                            return ({
                                claimable_at: oldPaymentDatum.subscription_end + (serviceDatum.interval_length * BigInt(i + 1)),
                                claimable_amount: serviceDatum.service_fee,
                            });
                        }))
                    };
                    newTotalSubscriptionFee = paymentUTxO.assets.lovelace + config.extension_intervals * serviceDatum.service_fee;
                    allDatums = { Payment: [paymentDatum] };
                    paymentValDatum = lucid_1.Data.to(allDatums, contract_types_js_1.PaymentValidatorDatum);
                    extendRedeemer = {
                        kind: "selected",
                        makeRedeemer: function (inputIndices) {
                            var result = lucid_1.Data.to(new lucid_1.Constr(0, [0n, inputIndices[0], 1n, config.extension_intervals]));
                            return result;
                        },
                        inputs: [paymentUTxO],
                    };
                    return [5 /*yield**/, __values(lucid
                            .newTx()
                            .collectFrom([paymentUTxO], extendRedeemer)
                            .readFrom([serviceUTxO])
                            .pay.ToAddress(subscriberAddress, (_a = {}, _a[subscriberNFT] = 1n, _a))
                            .pay.ToAddressWithData(paymentValidator.spendValAddress, {
                            kind: "inline",
                            value: paymentValDatum,
                        }, (_b = {
                                lovelace: newTotalSubscriptionFee
                            },
                            _b[paymentNFT] = 1n,
                            _b))
                            .attach.SpendingValidator(paymentValidator.spendValidator)
                            .completeProgram())];
                case 4:
                    tx = _c.sent();
                    return [2 /*return*/, tx];
            }
        });
    });
};
exports.extendSubscriptionProgram = extendSubscriptionProgram;
