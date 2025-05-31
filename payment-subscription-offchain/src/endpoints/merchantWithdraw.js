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
exports.merchantWithdrawProgram = void 0;
var lucid_1 = require("@lucid-evolution/lucid");
var contract_types_js_1 = require("../core/contract.types.js");
var index_js_1 = require("../core/index.js");
var effect_1 = require("effect");
var utils_js_1 = require("./utils.js");
var constants_js_1 = require("../core/validators/constants.js");
var merchantWithdrawProgram = function (lucid, config) {
    return effect_1.Effect.gen(function () {
        var merchantAddress, validators, paymentUTxOs, merchantUTxOs, serviceRefNft, merchantNft, merchantUTxO, serviceUTxO, _a, paymentUTxO, paymentDatum, paymentNFT, previousSlot, _b, withdrawableAmount, withdrawableCount, newInstallments, newPaymentDatum, allDatums, paymentValDatum, merchantWithdrawRedeemer, remainingSubscriptionFee, remainingSubscriptionAssets, tx;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.wallet().address(); }))];
                case 1:
                    merchantAddress = _f.sent();
                    validators = (0, index_js_1.getMultiValidator)(lucid, constants_js_1.paymentScript);
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxosAt(validators.spendValAddress); }))];
                case 2:
                    paymentUTxOs = _f.sent();
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxosAt(merchantAddress); }))];
                case 3:
                    merchantUTxOs = _f.sent();
                    serviceRefNft = (0, lucid_1.toUnit)(constants_js_1.servicePolicyId, config.service_nft_tn);
                    merchantNft = (0, lucid_1.toUnit)(constants_js_1.servicePolicyId, config.merchant_nft_tn);
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxoByUnit(merchantNft); }))];
                case 4:
                    merchantUTxO = _f.sent();
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxoByUnit(serviceRefNft); }))];
                case 5:
                    serviceUTxO = _f.sent();
                    _a = (0, utils_js_1.findPaymentToWithdraw)(paymentUTxOs, config.service_nft_tn, config.subscriber_nft_tn), paymentUTxO = _a.paymentUTxO, paymentDatum = _a.paymentDatum;
                    paymentNFT = (0, lucid_1.toUnit)(constants_js_1.paymentPolicyId, (0, lucid_1.fromText)(index_js_1.PAYMENT_TOKEN_NAME));
                    previousSlot = config.current_time - 1000n;
                    _b = (0, utils_js_1.calculateClaimableIntervals)(previousSlot, paymentDatum), withdrawableAmount = _b.withdrawableAmount, withdrawableCount = _b.withdrawableCount, newInstallments = _b.newInstallments;
                    console.log("paymentDatum: ", paymentDatum);
                    console.log("currentTime: ", config.current_time);
                    console.log("First installment claimable_at: ", paymentDatum.installments[0].claimable_at);
                    console.log("withdrawableAmount: ", withdrawableAmount);
                    console.log("withdrawableCount: ", withdrawableCount);
                    console.log("newInstallments: ", newInstallments);
                    newPaymentDatum = {
                        service_nft_tn: paymentDatum.service_nft_tn,
                        subscriber_nft_tn: paymentDatum.subscriber_nft_tn,
                        subscription_start: paymentDatum.subscription_start,
                        subscription_end: paymentDatum.subscription_end,
                        original_subscription_end: paymentDatum.original_subscription_end,
                        installments: newInstallments,
                    };
                    allDatums = { Payment: [newPaymentDatum] };
                    paymentValDatum = lucid_1.Data.to(allDatums, contract_types_js_1.PaymentValidatorDatum);
                    merchantWithdrawRedeemer = {
                        kind: "selected",
                        makeRedeemer: function (inputIndices) {
                            return lucid_1.Data.to(new lucid_1.Constr(1, [
                                0n,
                                inputIndices[0],
                                inputIndices[1],
                                1n,
                                BigInt(withdrawableCount),
                            ]));
                        },
                        inputs: [merchantUTxO, paymentUTxO],
                    };
                    remainingSubscriptionFee = newInstallments.reduce(function (acc, i) { return acc + i.claimable_amount; }, 0n);
                    remainingSubscriptionAssets = remainingSubscriptionFee > 0n
                        ? (_c = { lovelace: remainingSubscriptionFee }, _c[paymentNFT] = 1n, _c) : (_d = {}, _d[paymentNFT] = 1n, _d);
                    return [5 /*yield**/, __values(lucid
                            .newTx()
                            .collectFrom(merchantUTxOs)
                            .collectFrom([paymentUTxO], merchantWithdrawRedeemer)
                            .readFrom([serviceUTxO])
                            .pay.ToAddress(merchantAddress, (_e = {
                                lovelace: withdrawableAmount
                            },
                            _e[merchantNft] = 1n,
                            _e))
                            .pay.ToContract(validators.spendValAddress, {
                            kind: "inline",
                            value: paymentValDatum,
                        }, remainingSubscriptionAssets)
                            .validFrom(Number(config.current_time))
                            .attach.SpendingValidator(validators.spendValidator)
                            .completeProgram())];
                case 6:
                    tx = _f.sent();
                    return [2 /*return*/, tx];
            }
        });
    });
};
exports.merchantWithdrawProgram = merchantWithdrawProgram;
