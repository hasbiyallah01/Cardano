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
exports.createAccountProgram = void 0;
var lucid_1 = require("@lucid-evolution/lucid");
var index_js_1 = require("../core/utils/index.js");
var contract_types_js_1 = require("../core/contract.types.js");
var assets_js_1 = require("../core/utils/assets.js");
var effect_1 = require("effect");
var constants_js_1 = require("../core/validators/constants.js");
var sha256_1 = require("@noble/hashes/sha256");
var utils_1 = require("@noble/hashes/utils");
var createAccountProgram = function (lucid, config) {
    return effect_1.Effect.gen(function () {
        var validators, accountPolicyId, subscriberAddress, selectedUTxOs, selectedUTxO, _a, refTokenName, userTokenName, createAccountRedeemer, currDatum, directDatum, refToken, userToken, mintingAssets, tx;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    validators = (0, index_js_1.getMultiValidator)(lucid, constants_js_1.accountScript);
                    accountPolicyId = (0, lucid_1.mintingPolicyToId)(validators.mintValidator);
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.wallet().address(); }))];
                case 1:
                    subscriberAddress = _e.sent();
                    return [5 /*yield**/, __values(effect_1.Effect.promise(function () { return lucid.utxosByOutRef([config.selected_out_ref]); }))];
                case 2:
                    selectedUTxOs = _e.sent();
                    if (!selectedUTxOs || !selectedUTxOs.length) {
                        console.error("UTxO (" + config.selected_out_ref + ") not found!");
                    }
                    selectedUTxO = selectedUTxOs[0];
                    _a = (0, assets_js_1.createCip68TokenNames)(selectedUTxO), refTokenName = _a.refTokenName, userTokenName = _a.userTokenName;
                    createAccountRedeemer = {
                        kind: "selected",
                        makeRedeemer: function (inputIndices) {
                            return lucid_1.Data.to(new lucid_1.Constr(0, [inputIndices[0], 1n]));
                        },
                        inputs: [selectedUTxO],
                    };
                    currDatum = {
                        email_hash: (0, utils_1.bytesToHex)((0, sha256_1.sha256)(config.email)),
                        phone_hash: (0, utils_1.bytesToHex)((0, sha256_1.sha256)(config.phone)),
                    };
                    directDatum = lucid_1.Data.to(currDatum, contract_types_js_1.AccountDatum);
                    refToken = (0, lucid_1.toUnit)(accountPolicyId, refTokenName);
                    userToken = (0, lucid_1.toUnit)(accountPolicyId, userTokenName);
                    mintingAssets = (_b = {},
                        _b[refToken] = 1n,
                        _b[userToken] = 1n,
                        _b);
                    return [5 /*yield**/, __values(lucid
                            .newTx()
                            .collectFrom([selectedUTxO])
                            .mintAssets(mintingAssets, createAccountRedeemer)
                            .pay.ToAddress(subscriberAddress, (_c = {}, _c[userToken] = 1n, _c))
                            .pay.ToContract(validators.mintValAddress, {
                            kind: "inline",
                            value: directDatum,
                        }, (_d = {}, _d[refToken] = 1n, _d))
                            .attach.MintingPolicy(validators.mintValidator)
                            .completeProgram())];
                case 3:
                    tx = _e.sent();
                    return [2 /*return*/, tx];
            }
        });
    });
};
exports.createAccountProgram = createAccountProgram;
