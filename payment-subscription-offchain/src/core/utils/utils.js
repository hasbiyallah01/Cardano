"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.divCeil = exports.replacer = exports.chunkArray = exports.fromAddressToData = exports.generateAccountSeedPhrase = exports.toCBORHex = exports.parseUTxOsAtScript = exports.parseSafeDatum = exports.utxosAtScript = void 0;
exports.ok = ok;
exports.fromAddress = fromAddress;
exports.toAddress = toAddress;
exports.union = union;
exports.fromAssets = fromAssets;
exports.toAssets = toAssets;
exports.selectUtxos = selectUtxos;
exports.getInputUtxoIndices = getInputUtxoIndices;
exports.sortByOutRefWithIndex = sortByOutRefWithIndex;
exports.sumUtxoAssets = sumUtxoAssets;
exports.remove = remove;
var lucid_1 = require("@lucid-evolution/lucid");
function ok(x) {
    return {
        type: "ok",
        data: x,
    };
}
var utxosAtScript = function (lucid, script, stakeCredentialHash) { return __awaiter(void 0, void 0, void 0, function () {
    var network, scriptValidator, scriptValidatorAddr;
    return __generator(this, function (_a) {
        network = lucid.config().network;
        if (!network) {
            throw Error("Invalid Network option");
        }
        scriptValidator = {
            type: "PlutusV3",
            script: script,
        };
        scriptValidatorAddr = stakeCredentialHash
            ? (0, lucid_1.validatorToAddress)(network, scriptValidator, (0, lucid_1.keyHashToCredential)(stakeCredentialHash))
            : (0, lucid_1.validatorToAddress)(network, scriptValidator);
        return [2 /*return*/, lucid.utxosAt(scriptValidatorAddr)];
    });
}); };
exports.utxosAtScript = utxosAtScript;
var parseSafeDatum = function (datum, datumType) {
    if (datum) {
        try {
            var parsedDatum = lucid_1.Data.from(datum, datumType);
            return {
                type: "right",
                value: parsedDatum,
            };
        }
        catch (error) {
            return { type: "left", value: "invalid datum : ".concat(error) };
        }
    }
    else {
        return { type: "left", value: "missing datum" };
    }
};
exports.parseSafeDatum = parseSafeDatum;
var parseUTxOsAtScript = function (lucid, script, datumType, stakeCredentialHash) { return __awaiter(void 0, void 0, void 0, function () {
    var utxos, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, exports.utxosAtScript)(lucid, script, stakeCredentialHash)];
            case 1:
                utxos = _a.sent();
                return [2 /*return*/, utxos.flatMap(function (utxo) {
                        var result = (0, exports.parseSafeDatum)(utxo.datum, datumType);
                        if (result.type == "right") {
                            return {
                                outRef: {
                                    txHash: utxo.txHash,
                                    outputIndex: utxo.outputIndex,
                                },
                                datum: result.value,
                                assets: utxo.assets,
                            };
                        }
                        else {
                            return [];
                        }
                    })];
            case 2:
                e_1 = _a.sent();
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.parseUTxOsAtScript = parseUTxOsAtScript;
var toCBORHex = function (rawHex) {
    return (0, lucid_1.applyDoubleCborEncoding)(rawHex);
};
exports.toCBORHex = toCBORHex;
var generateAccountSeedPhrase = function (assets) { return __awaiter(void 0, void 0, void 0, function () {
    var seedPhrase, lucid, address;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                seedPhrase = (0, lucid_1.generateSeedPhrase)();
                return [4 /*yield*/, (0, lucid_1.Lucid)(new lucid_1.Emulator([]), "Custom")];
            case 1:
                lucid = _a.sent();
                lucid.selectWallet.fromSeed(seedPhrase);
                address = lucid.wallet().address;
                return [2 /*return*/, {
                        seedPhrase: seedPhrase,
                        address: address,
                        assets: assets,
                    }];
        }
    });
}); };
exports.generateAccountSeedPhrase = generateAccountSeedPhrase;
function fromAddress(address) {
    var _a = (0, lucid_1.getAddressDetails)(address), paymentCredential = _a.paymentCredential, stakeCredential = _a.stakeCredential;
    if (!paymentCredential)
        throw new Error("Not a valid payment address.");
    return {
        paymentCredential: (paymentCredential === null || paymentCredential === void 0 ? void 0 : paymentCredential.type) === "Key"
            ? {
                PublicKeyCredential: [paymentCredential.hash],
            }
            : { ScriptCredential: [paymentCredential.hash] },
        stakeCredential: stakeCredential
            ? {
                Inline: [
                    stakeCredential.type === "Key"
                        ? {
                            PublicKeyCredential: [stakeCredential.hash],
                        }
                        : { ScriptCredential: [stakeCredential.hash] },
                ],
            }
            : null,
    };
}
function toAddress(address, network) {
    var paymentCredential = (function () {
        if ("PublicKeyCredential" in address.paymentCredential) {
            return (0, lucid_1.keyHashToCredential)(address.paymentCredential.PublicKeyCredential[0]);
        }
        else {
            return (0, lucid_1.scriptHashToCredential)(address.paymentCredential.ScriptCredential[0]);
        }
    })();
    var stakeCredential = (function () {
        if (!address.stakeCredential)
            return undefined;
        if ("Inline" in address.stakeCredential) {
            if ("PublicKeyCredential" in address.stakeCredential.Inline[0]) {
                return (0, lucid_1.keyHashToCredential)(address.stakeCredential.Inline[0].PublicKeyCredential[0]);
            }
            else {
                return (0, lucid_1.scriptHashToCredential)(address.stakeCredential.Inline[0].ScriptCredential[0]);
            }
        }
        else {
            return undefined;
        }
    })();
    return (0, lucid_1.credentialToAddress)(network, paymentCredential, stakeCredential);
}
var fromAddressToData = function (address) {
    var addrDetails = (0, lucid_1.getAddressDetails)(address);
    if (!addrDetails.paymentCredential) {
        return { type: "error", error: new Error("undefined paymentCredential") };
    }
    var paymentCred = addrDetails.paymentCredential.type == "Key"
        ? new lucid_1.Constr(0, [addrDetails.paymentCredential.hash])
        : new lucid_1.Constr(1, [addrDetails.paymentCredential.hash]);
    if (!addrDetails.stakeCredential) {
        return {
            type: "ok",
            data: new lucid_1.Constr(0, [paymentCred, new lucid_1.Constr(1, [])]),
        };
    }
    var stakingCred = new lucid_1.Constr(0, [
        new lucid_1.Constr(0, [new lucid_1.Constr(0, [addrDetails.stakeCredential.hash])]),
    ]);
    return { type: "ok", data: new lucid_1.Constr(0, [paymentCred, stakingCred]) };
};
exports.fromAddressToData = fromAddressToData;
var chunkArray = function (array, chunkSize) {
    var numberOfChunks = Math.ceil(array.length / chunkSize);
    return __spreadArray([], Array(numberOfChunks), true).map(function (_value, index) {
        return array.slice(index * chunkSize, (index + 1) * chunkSize);
    });
};
exports.chunkArray = chunkArray;
var replacer = function (_key, value) {
    return typeof value === "bigint" ? value.toString() : value;
};
exports.replacer = replacer;
var divCeil = function (a, b) {
    return 1n + (a - 1n) / b;
};
exports.divCeil = divCeil;
function union(a1, a2) {
    var a2Entries = Object.entries(a2);
    var result = __assign({}, a1);
    a2Entries.forEach(function (_a) {
        var key = _a[0], quantity = _a[1];
        if (result[key]) {
            result[key] += quantity;
        }
        else {
            result[key] = quantity;
        }
    });
    return result;
}
function fromAssets(assets) {
    var value = new Map();
    if (assets.lovelace)
        value.set("", new Map([["", assets.lovelace]]));
    var units = Object.keys(assets);
    var policies = Array.from(new Set(units
        .filter(function (unit) { return unit !== "lovelace"; })
        .map(function (unit) { return unit.slice(0, 56); })));
    policies.sort().forEach(function (policyId) {
        var policyUnits = units.filter(function (unit) { return unit.slice(0, 56) === policyId; });
        var assetsMap = new Map();
        policyUnits.sort().forEach(function (unit) {
            assetsMap.set(unit.slice(56), assets[unit]);
        });
        value.set(policyId, assetsMap);
    });
    return value;
}
function toAssets(value) {
    var _a;
    var result = { lovelace: ((_a = value.get("")) === null || _a === void 0 ? void 0 : _a.get("")) || BigInt(0) };
    for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
        var _b = value_1[_i], policyId = _b[0], assets = _b[1];
        if (policyId === "")
            continue;
        for (var _c = 0, assets_1 = assets; _c < assets_1.length; _c++) {
            var _d = assets_1[_c], assetName = _d[0], amount = _d[1];
            result[policyId + assetName] = amount;
        }
    }
    return result;
}
function selectUtxos(utxos, minAssets) {
    var selectedUtxos = [];
    var isSelected = false;
    var assetsRequired = new Map(Object.entries(minAssets));
    for (var _i = 0, utxos_1 = utxos; _i < utxos_1.length; _i++) {
        var utxo = utxos_1[_i];
        if (utxo.scriptRef) {
            continue;
        }
        isSelected = false;
        for (var _a = 0, assetsRequired_1 = assetsRequired; _a < assetsRequired_1.length; _a++) {
            var _b = assetsRequired_1[_a], unit = _b[0], value = _b[1];
            if (Object.hasOwn(utxo.assets, unit)) {
                var utxoValue = utxo.assets[unit];
                if (utxoValue >= value) {
                    assetsRequired.delete(unit);
                }
                else {
                    assetsRequired.set(unit, value - utxoValue);
                }
                isSelected = true;
            }
        }
        if (isSelected) {
            selectedUtxos.push(utxo);
        }
        if (assetsRequired.size == 0) {
            break;
        }
    }
    if (assetsRequired.size > 0) {
        return { type: "error", error: new Error("Insufficient funds") };
    }
    return { type: "ok", data: selectedUtxos };
}
function getInputUtxoIndices(indexInputs, remainingInputs) {
    var allInputs = indexInputs.concat(remainingInputs);
    var sortedInputs = sortByOutRefWithIndex(allInputs);
    var indicesMap = new Map();
    sortedInputs.forEach(function (value, index) {
        indicesMap.set(value.txHash + value.outputIndex, BigInt(index));
    });
    return indexInputs.flatMap(function (value) {
        var index = indicesMap.get(value.txHash + value.outputIndex);
        if (index !== undefined)
            return index;
        else
            return [];
    });
}
function sortByOutRefWithIndex(utxos) {
    return utxos.sort(function (a, b) {
        if (a.txHash < b.txHash) {
            return -1;
        }
        else if (a.txHash > b.txHash) {
            return 1;
        }
        else if (a.txHash == b.txHash) {
            if (a.outputIndex < b.outputIndex) {
                return -1;
            }
            else
                return 1;
        }
        else
            return 0;
    });
}
function sumUtxoAssets(utxos) {
    return utxos
        .map(function (utxo) { return utxo.assets; })
        .reduce(function (acc, assets) { return (0, lucid_1.addAssets)(acc, assets); }, {});
}
function remove(a, b) {
    for (var _i = 0, _a = Object.entries(b); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (Object.hasOwn(a, key)) {
            if (a[key] < value)
                delete a[key];
            else if (a[key] > value)
                a[key] -= value;
            else
                delete a[key];
        }
    }
    return a;
}
