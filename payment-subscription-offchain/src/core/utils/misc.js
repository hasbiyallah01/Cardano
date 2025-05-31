"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMultiValidator = void 0;
var lucid_1 = require("@lucid-evolution/lucid");
var getMultiValidator = function (lucid, scripts) {
    var mintValidator = {
        type: "PlutusV3",
        script: scripts.minting,
    };
    var network = lucid.config().network;
    if (!network) {
        throw Error("Invalid Network option");
    }
    var mintAddress = (0, lucid_1.validatorToAddress)(network, mintValidator);
    var spendValidator = {
        type: "PlutusV3",
        script: scripts.spending,
    };
    var spendValidatorAddress = (0, lucid_1.validatorToAddress)(network, spendValidator);
    return {
        spendValidator: spendValidator,
        spendValAddress: spendValidatorAddress,
        mintValidator: mintValidator,
        mintValAddress: mintAddress,
    };
};
exports.getMultiValidator = getMultiValidator;
