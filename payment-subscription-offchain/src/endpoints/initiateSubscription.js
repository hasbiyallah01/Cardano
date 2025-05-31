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
exports.initSubscriptionProgram = void 0;
var lucid_1 = require("@lucid-evolution/lucid");
var contract_types_js_1 = require("../core/contract.types.js");
var index_js_1 = require("../core/index.js");
var effect_1 = require("effect");
var constants_js_1 = require("../core/validators/constants.js");
var utils_js_1 = require("./utils.js");
var initSubscriptionProgram = function (lucid, config) {
    return effect_1.Effect.gen(function () {
        var validators, paymentPolicyId, subscriberNft, serviceNft, serviceUTxO, subscriberUTxO, paymentNFT, initiateSubscriptionRedeemer, serviceData, serviceDatum, interval_amount, interval_length, subscription_end, totalSubscriptionQty, createInstallments, paymentDatum, allDatums, paymentValDatum, tx;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    validators = (0, index_js_1.getMultiValidator)(lucid, constants_js_1.paymentScript);
                    paymentPolicyId = (0, lucid_1.mintingPolicyToId)(validators.mintValidator);
                    subscriberNft = (0, lucid_1.toUnit)(constants_js_1.accountPolicyId, config.subscriber_nft_tn);
                    serviceNft = (0, lucid_1.toUnit)(constants_js_1.servicePolicyId, config.service_nft_tn);
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxoByUnit(serviceNft); }))];
                case 1:
                    serviceUTxO = _c.sent();
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxoByUnit(subscriberNft); }))];
                case 2:
                    subscriberUTxO = _c.sent();
                    if (!subscriberUTxO) {
                        throw new Error(" subscriberUTxO not found");
                    }
                    paymentNFT = (0, lucid_1.toUnit)(paymentPolicyId, (0, lucid_1.fromText)(index_js_1.PAYMENT_TOKEN_NAME));
                    initiateSubscriptionRedeemer = {
                        kind: "selected",
                        makeRedeemer: function (inputIndices) {
                            var paymentRedeemer = {
                                service_ref_input_index: 0n,
                                subscriber_input_index: inputIndices[0],
                                payment_output_index: 0n,
                            };
                            var redeemerData = lucid_1.Data.to(paymentRedeemer, contract_types_js_1.InitSubscription);
                            return redeemerData;
                        },
                        inputs: [subscriberUTxO],
                    };
                    serviceData = (0, utils_js_1.getServiceValidatorDatum)(serviceUTxO);
                    if (!serviceData || !serviceData.length) {
                        throw new Error("Service not found");
                    }
                    serviceDatum = serviceData[0];
                    interval_amount = serviceDatum.service_fee;
                    interval_length = serviceDatum.interval_length;
                    subscription_end = config.subscription_start + interval_length * serviceDatum.num_intervals;
                    totalSubscriptionQty = interval_amount * serviceDatum.num_intervals;
                    createInstallments = function (startTime, intervalLength, intervalAmount, numIntervals) {
                        return Array.from({ length: numIntervals }, function (_, i) {
                            return ({
                                claimable_at: startTime + (intervalLength * BigInt(i + 1)),
                                claimable_amount: intervalAmount,
                            });
                        });
                    };
                    paymentDatum = {
                        service_nft_tn: config.service_nft_tn,
                        subscriber_nft_tn: config.subscriber_nft_tn,
                        subscription_start: config.subscription_start,
                        subscription_end: subscription_end,
                        original_subscription_end: subscription_end,
                        installments: createInstallments(config.subscription_start, interval_length, interval_amount, Number(serviceDatum.num_intervals)),
                    };
                    allDatums = {
                        Payment: [paymentDatum],
                    };
                    paymentValDatum = lucid_1.Data.to(allDatums, contract_types_js_1.PaymentValidatorDatum);
                    console.log("config.subscription_start: ", config.subscription_start);
                    return [5 /*yield**/, __values(lucid
                            .newTx()
                            .readFrom([serviceUTxO])
                            .collectFrom([subscriberUTxO])
                            .mintAssets((_a = {}, _a[paymentNFT] = 1n, _a), initiateSubscriptionRedeemer)
                            .pay.ToAddressWithData(validators.spendValAddress, {
                            kind: "inline",
                            value: paymentValDatum,
                        }, (_b = {},
                            _b[paymentNFT] = 1n,
                            _b.lovelace = totalSubscriptionQty,
                            _b))
                            .validTo(Number(config.subscription_start) - 1000)
                            .attach.MintingPolicy(validators.mintValidator)
                            .completeProgram())];
                case 3:
                    tx = _c.sent();
                    return [2 /*return*/, tx];
            }
        });
    });
};
exports.initSubscriptionProgram = initSubscriptionProgram;
