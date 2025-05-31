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
exports.updateServiceProgram = void 0;
var lucid_1 = require("@lucid-evolution/lucid");
var index_js_1 = require("../core/utils/index.js");
var contract_types_js_1 = require("../core/contract.types.js");
var effect_1 = require("effect");
var utils_js_1 = require("./utils.js");
var constants_js_1 = require("../core/validators/constants.js");
var updateServiceProgram = function (lucid, config) {
    return effect_1.Effect.gen(function () {
        var validators, serviceValAddress, serviceNFT, merchantNFT, serviceUTxO, merchantUTxO, serviceData, serviceDatum, updatedDatum, directDatum, updateServiceRedeemer, tx;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    validators = (0, index_js_1.getMultiValidator)(lucid, constants_js_1.serviceScript);
                    serviceValAddress = validators.spendValAddress;
                    serviceNFT = (0, lucid_1.toUnit)(constants_js_1.servicePolicyId, config.service_nft_tn);
                    merchantNFT = (0, lucid_1.toUnit)(constants_js_1.servicePolicyId, config.merchant_nft_tn);
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxoByUnit(serviceNFT); }))];
                case 1:
                    serviceUTxO = _b.sent();
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxoByUnit(merchantNFT); }))];
                case 2:
                    merchantUTxO = _b.sent();
                    if (!serviceUTxO) {
                        throw new Error("Service NFT not found");
                    }
                    serviceData = (0, utils_js_1.getServiceValidatorDatum)(serviceUTxO);
                    if (!serviceData || !serviceData.length) {
                        throw new Error("Service not found");
                    }
                    serviceDatum = serviceData[0];
                    updatedDatum = {
                        service_fee_policyid: serviceDatum.service_fee_policyid,
                        service_fee_assetname: serviceDatum.service_fee_assetname,
                        service_fee: config.new_service_fee,
                        penalty_fee_policyid: serviceDatum.penalty_fee_policyid,
                        penalty_fee_assetname: serviceDatum.penalty_fee_assetname,
                        penalty_fee: config.new_penalty_fee,
                        interval_length: config.new_interval_length,
                        num_intervals: config.new_num_intervals,
                        is_active: serviceDatum.is_active,
                    };
                    directDatum = lucid_1.Data.to(updatedDatum, contract_types_js_1.ServiceDatum);
                    updateServiceRedeemer = {
                        kind: "selected",
                        makeRedeemer: function (inputIndices) {
                            return lucid_1.Data.to(new lucid_1.Constr(0, [config.service_nft_tn, inputIndices[0], inputIndices[1], 0n]));
                        },
                        inputs: [merchantUTxO, serviceUTxO],
                    };
                    return [5 /*yield**/, __values(lucid
                            .newTx()
                            .collectFrom([merchantUTxO])
                            .collectFrom([serviceUTxO], updateServiceRedeemer)
                            .pay.ToContract(serviceValAddress, {
                            kind: "inline",
                            value: directDatum,
                        }, (_a = {},
                            _a[serviceNFT] = 1n,
                            _a))
                            .attach.SpendingValidator(validators.spendValidator)
                            .completeProgram({ localUPLCEval: true }))];
                case 3:
                    tx = _b.sent();
                    return [2 /*return*/, tx];
            }
        });
    });
};
exports.updateServiceProgram = updateServiceProgram;
