"use strict";
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
exports.tokenNameFromUTxO = exports.generateUniqueAssetName = exports.findSubscriberPaymentTokenName = exports.findCip68TokenNames = exports.createCip68TokenNames = exports.assetNameLabels = void 0;
var utils_1 = require("@noble/hashes/utils");
var sha3_1 = require("@noble/hashes/sha3");
var utils_js_1 = require("../../endpoints/utils.js");
var assetNameLabels = {
    prefix100: "000643b0",
    prefix222: "000de140",
    prefix333: "0014df10",
    prefix444: "001bc280",
};
exports.assetNameLabels = assetNameLabels;
var generateUniqueAssetName = function (utxo, prefix) {
    var txIdHash = (0, sha3_1.sha3_256)((0, utils_1.hexToBytes)(utxo.txHash));
    var indexByte = new Uint8Array([utxo.outputIndex]);
    var prependIndex = (0, utils_1.concatBytes)(indexByte, txIdHash);
    if (prefix != null) {
        var prependPrefix = (0, utils_1.concatBytes)((0, utils_1.hexToBytes)(prefix), prependIndex);
        return (0, utils_1.bytesToHex)(prependPrefix.slice(0, 32));
    }
    else {
        return (0, utils_1.bytesToHex)(prependIndex.slice(0, 32));
    }
};
exports.generateUniqueAssetName = generateUniqueAssetName;
var findCip68TokenNames = function (walletUtxos, contractUtxos, policyId) {
    var refPrefix = assetNameLabels.prefix100;
    var userPrefix = assetNameLabels.prefix222;
    console.log("Debug - Processing inputs:", {
        policyId: policyId,
        walletUtxoCount: walletUtxos.length,
        contractUtxoCount: contractUtxos.length,
    });
    var latestUserToken = "";
    var latestTxHash = "";
    for (var _i = 0, walletUtxos_1 = walletUtxos; _i < walletUtxos_1.length; _i++) {
        var utxo = walletUtxos_1[_i];
        for (var _a = 0, _b = Object.entries(utxo.assets); _a < _b.length; _a++) {
            var _c = _b[_a], assetName = _c[0], amount = _c[1];
            if (amount === 1n && assetName.startsWith(policyId)) {
                var tokenName = assetName.slice(policyId.length);
                if (tokenName.startsWith(userPrefix)) {
                    if (!latestTxHash || utxo.txHash > latestTxHash) {
                        latestUserToken = tokenName;
                        latestTxHash = utxo.txHash;
                        console.log("Debug - Found newer user token:", {
                            token: latestUserToken,
                            txHash: latestTxHash,
                        });
                    }
                }
            }
        }
    }
    if (!latestUserToken) {
        var allUtxos = __spreadArray(__spreadArray([], walletUtxos, true), contractUtxos, true);
        for (var _d = 0, allUtxos_1 = allUtxos; _d < allUtxos_1.length; _d++) {
            var utxo = allUtxos_1[_d];
            for (var _e = 0, _f = Object.entries(utxo.assets); _e < _f.length; _e++) {
                var _g = _f[_e], assetName = _g[0], amount = _g[1];
                if (amount === 1n && assetName.startsWith(policyId)) {
                    var tokenName = assetName.slice(policyId.length);
                    if (tokenName.startsWith(userPrefix)) {
                        if (!latestTxHash || utxo.txHash > latestTxHash) {
                            latestUserToken = tokenName;
                            latestTxHash = utxo.txHash;
                        }
                    }
                }
            }
        }
    }
    if (!latestUserToken) {
        console.log("Debug - No user token found. Available assets:", {
            walletAssets: walletUtxos.map(function (u) { return Object.keys(u.assets); }),
            contractAssets: contractUtxos.map(function (u) { return Object.keys(u.assets); }),
        });
        throw new Error("No user token found in UTxOs");
    }
    var userSuffix = latestUserToken.slice(userPrefix.length);
    var matchingRefToken = null;
    for (var _h = 0, contractUtxos_1 = contractUtxos; _h < contractUtxos_1.length; _h++) {
        var utxo = contractUtxos_1[_h];
        for (var _j = 0, _k = Object.entries(utxo.assets); _j < _k.length; _j++) {
            var _l = _k[_j], assetName = _l[0], amount = _l[1];
            if (amount === 1n && assetName.startsWith(policyId)) {
                var tokenName = assetName.slice(policyId.length);
                if (tokenName.startsWith(refPrefix) &&
                    tokenName.slice(refPrefix.length) === userSuffix) {
                    matchingRefToken = tokenName;
                    break;
                }
            }
        }
        if (matchingRefToken)
            break;
    }
    if (!matchingRefToken) {
        var allUtxos = __spreadArray(__spreadArray([], walletUtxos, true), contractUtxos, true);
        for (var _m = 0, allUtxos_2 = allUtxos; _m < allUtxos_2.length; _m++) {
            var utxo = allUtxos_2[_m];
            for (var _o = 0, _p = Object.entries(utxo.assets); _o < _p.length; _o++) {
                var _q = _p[_o], assetName = _q[0], amount = _q[1];
                if (amount === 1n && assetName.startsWith(policyId)) {
                    var tokenName = assetName.slice(policyId.length);
                    if (tokenName.startsWith(refPrefix) &&
                        tokenName.slice(refPrefix.length) === userSuffix) {
                        matchingRefToken = tokenName;
                        break;
                    }
                }
            }
            if (matchingRefToken)
                break;
        }
    }
    if (!matchingRefToken) {
        console.log("Debug - No matching ref token found for user token:", latestUserToken);
        console.log("Debug - Available assets:", {
            walletAssets: walletUtxos.map(function (u) { return Object.keys(u.assets); }),
            contractAssets: contractUtxos.map(function (u) { return Object.keys(u.assets); }),
        });
        throw new Error("No matching reference token found for user token ".concat(latestUserToken));
    }
    var result = {
        refTokenName: matchingRefToken,
        userTokenName: latestUserToken,
    };
    console.log("Debug - Returning token pair:", result);
    return result;
};
exports.findCip68TokenNames = findCip68TokenNames;
var createCip68TokenNames = function (utxo) {
    var refTokenName = generateUniqueAssetName(utxo, assetNameLabels.prefix100);
    var userTokenName = generateUniqueAssetName(utxo, assetNameLabels.prefix222);
    return { refTokenName: refTokenName, userTokenName: userTokenName };
};
exports.createCip68TokenNames = createCip68TokenNames;
var tokenNameFromUTxO = function (utxoOrUtxos, policyId) {
    var utxos = Array.isArray(utxoOrUtxos) ? utxoOrUtxos : [utxoOrUtxos];
    for (var _i = 0, utxos_1 = utxos; _i < utxos_1.length; _i++) {
        var utxo = utxos_1[_i];
        var assets = utxo.assets;
        for (var _a = 0, _b = Object.entries(assets); _a < _b.length; _a++) {
            var _c = _b[_a], assetId = _c[0], amount = _c[1];
            if (amount === 1n && assetId.startsWith(policyId)) {
                var tokenName = assetId.slice(policyId.length);
                return tokenName;
            }
        }
    }
    return "";
};
exports.tokenNameFromUTxO = tokenNameFromUTxO;
var findSubscriberPaymentTokenName = function (paymentUTxOs, subscriberNftTn, serviceNftTn, paymentPolicyId) {
    console.log("Searching for subscription with:", {
        serviceNftTn: serviceNftTn,
        subscriberNftTn: subscriberNftTn,
    });
    var results = paymentUTxOs.map(function (utxo) {
        try {
            var datums = (0, utils_js_1.getPaymentValidatorDatum)(utxo);
            console.log("UTxO", utxo.txHash.slice(0, 8), "datum result:", {
                found: datums.length > 0,
                datum: datums[0],
                matches: datums.length > 0 &&
                    datums[0].subscriber_nft_tn === subscriberNftTn &&
                    datums[0].service_nft_tn === serviceNftTn,
            });
            return datums.length > 0 &&
                datums[0].subscriber_nft_tn === subscriberNftTn &&
                datums[0].service_nft_tn === serviceNftTn
                ? tokenNameFromUTxO([utxo], paymentPolicyId)
                : null;
        }
        catch (error) {
            console.error("Error processing UTxO", utxo.txHash.slice(0, 8), error);
            return null;
        }
    });
    var paymentNftTn = results.find(function (result) { return result !== null; });
    if (!paymentNftTn) {
        throw new Error("No active subscription found for this subscriber and service");
    }
    return paymentNftTn;
};
exports.findSubscriberPaymentTokenName = findSubscriberPaymentTokenName;
