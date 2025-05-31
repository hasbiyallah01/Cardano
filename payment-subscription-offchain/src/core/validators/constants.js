"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceValidator = exports.serviceScript = exports.servicePolicyId = exports.paymentValidator = exports.paymentScript = exports.paymentPolicyId = exports.deployValidator = exports.deployScript = exports.alwaysFailScript = exports.accountValidator = exports.accountScript = exports.accountPolicyId = void 0;
var lucid_1 = require("@lucid-evolution/lucid");
var validators_js_1 = require("../compiled/validators.js");
var plutus_json_1 = require("../compiled/plutus.json");
var serviceValidator = (0, validators_js_1.readMultiValidators)(plutus_json_1.default, false, []);
exports.serviceValidator = serviceValidator;
var servicePolicyId = (0, lucid_1.mintingPolicyToId)(serviceValidator.mintService);
exports.servicePolicyId = servicePolicyId;
var serviceScript = {
    spending: serviceValidator.spendService.script,
    minting: serviceValidator.mintService.script,
    staking: "",
};
exports.serviceScript = serviceScript;
var accountValidator = (0, validators_js_1.readMultiValidators)(plutus_json_1.default, false, []);
exports.accountValidator = accountValidator;
var accountPolicyId = (0, lucid_1.mintingPolicyToId)(accountValidator.mintAccount);
exports.accountPolicyId = accountPolicyId;
var accountScript = {
    spending: accountValidator.spendAccount.script,
    minting: accountValidator.mintAccount.script,
    staking: "",
};
exports.accountScript = accountScript;
var paymentValidator = (0, validators_js_1.readMultiValidators)(plutus_json_1.default, true, [
    servicePolicyId,
    accountPolicyId,
]);
exports.paymentValidator = paymentValidator;
var paymentPolicyId = (0, lucid_1.mintingPolicyToId)(paymentValidator.mintPayment);
exports.paymentPolicyId = paymentPolicyId;
var paymentScript = {
    spending: paymentValidator.spendPayment.script,
    minting: paymentValidator.mintPayment.script,
    staking: "",
};
exports.paymentScript = paymentScript;
var deployValidator = (0, validators_js_1.readMultiValidators)(plutus_json_1.default, false, []);
exports.deployValidator = deployValidator;
var deployScript = {
    spending: deployValidator.spendPayment.script,
    minting: deployValidator.mintPayment.script,
    staking: "",
};
exports.deployScript = deployScript;
var alwaysFailScript = {
    spending: deployValidator.alwaysFails.script,
    minting: "",
    staking: "",
};
exports.alwaysFailScript = alwaysFailScript;
