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
exports.unsubscribeProgram = void 0;
var lucid_1 = require("@lucid-evolution/lucid");
var index_js_1 = require("../core/utils/index.js");
var contract_types_js_1 = require("../core/contract.types.js");
var effect_1 = require("effect");
var utils_js_1 = require("./utils.js");
var constants_js_1 = require("../core/validators/constants.js");
var constants_js_2 = require("../core/constants.js");
var unsubscribeProgram = function (lucid, config) {
    return effect_1.Effect.gen(function () {
        var subscriberAddress, paymentValidators, paymentAddress, paymentNFT, paymentUTxOs, result, paymentUTxO, paymentDatum, serviceRefNft, subscriberNft, serviceUTxO, subscriberUTxO, serviceData, serviceDatum, unsubscribeRedeemer, tx, subscriber_refund, penaltyDatum, allDatums, penaltyValDatum, tx;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.wallet().address(); }))];
                case 1:
                    subscriberAddress = _d.sent();
                    paymentValidators = (0, index_js_1.getMultiValidator)(lucid, constants_js_1.paymentScript);
                    paymentAddress = paymentValidators.spendValAddress;
                    paymentNFT = (0, lucid_1.toUnit)(constants_js_1.paymentPolicyId, (0, lucid_1.fromText)(constants_js_2.PAYMENT_TOKEN_NAME));
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxosAt(paymentValidators.spendValAddress); }))];
                case 2:
                    paymentUTxOs = _d.sent();
                    result = paymentUTxOs
                        .flatMap(function (utxo) { return (0, utils_js_1.getPaymentValidatorDatum)(utxo).map(function (datum) { return [utxo, datum]; }); })
                        .find(function (_a) {
                        var _utxo = _a[0], datum = _a[1];
                        return datum.service_nft_tn === config.service_nft_tn && datum.subscriber_nft_tn === config.subscriber_nft_tn;
                    });
                    if (!result) {
                        throw new Error("No active subscription found");
                    }
                    paymentUTxO = result[0], paymentDatum = result[1];
                    serviceRefNft = (0, lucid_1.toUnit)(constants_js_1.servicePolicyId, config.service_nft_tn);
                    subscriberNft = (0, lucid_1.toUnit)(constants_js_1.accountPolicyId, config.subscriber_nft_tn);
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxoByUnit(serviceRefNft); }))];
                case 3:
                    serviceUTxO = _d.sent();
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxoByUnit(subscriberNft); }))];
                case 4:
                    subscriberUTxO = _d.sent();
                    serviceData = (0, utils_js_1.getServiceValidatorDatum)(serviceUTxO);
                    if (!serviceData || !serviceData.length) {
                        throw new Error("Service not found");
                    }
                    serviceDatum = serviceData[0];
                    unsubscribeRedeemer = {
                        kind: "selected",
                        makeRedeemer: function (inputIndices) {
                            return lucid_1.Data.to(new lucid_1.Constr(2, [0n, inputIndices[0], inputIndices[1], 1n]));
                        },
                        inputs: [subscriberUTxO, paymentUTxO],
                    };
                    if (!(paymentDatum.original_subscription_end <= config.current_time)) return [3 /*break*/, 6];
                    return [5 /*yield**/, __values(lucid
                            .newTx()
                            .collectFrom([subscriberUTxO])
                            .collectFrom([paymentUTxO], unsubscribeRedeemer)
                            .readFrom([serviceUTxO])
                            .validFrom(Number(config.current_time))
                            .mintAssets((_a = {}, _a[paymentNFT] = -1n, _a), lucid_1.Data.to(new lucid_1.Constr(1, [])))
                            .attach.SpendingValidator(paymentValidators.spendValidator)
                            .attach.MintingPolicy(paymentValidators.mintValidator)
                            .completeProgram())];
                case 5:
                    tx = _d.sent();
                    return [2 /*return*/, tx];
                case 6:
                    subscriber_refund = paymentUTxO.assets.lovelace - serviceDatum.penalty_fee;
                    penaltyDatum = {
                        service_nft_tn: config.service_nft_tn,
                        subscriber_nft_tn: config.subscriber_nft_tn
                    };
                    allDatums = { Penalty: [penaltyDatum] };
                    penaltyValDatum = lucid_1.Data.to(allDatums, contract_types_js_1.PaymentValidatorDatum);
                    return [5 /*yield**/, __values(lucid
                            .newTx()
                            .collectFrom([subscriberUTxO])
                            .collectFrom([paymentUTxO], unsubscribeRedeemer)
                            .readFrom([serviceUTxO])
                            .pay.ToAddress(subscriberAddress, (_b = {
                                lovelace: subscriber_refund
                            },
                            _b[subscriberNft] = 1n,
                            _b))
                            .pay.ToAddressWithData(paymentAddress, {
                            kind: "inline",
                            value: penaltyValDatum,
                        }, (_c = {
                                lovelace: serviceDatum.penalty_fee
                            },
                            _c[paymentNFT] = 1n,
                            _c))
                            .validFrom(Number(config.current_time))
                            .attach.SpendingValidator(paymentValidators.spendValidator)
                            .completeProgram())];
                case 7:
                    tx = _d.sent();
                    return [2 /*return*/, tx];
            }
        });
    });
};
exports.unsubscribeProgram = unsubscribeProgram;
