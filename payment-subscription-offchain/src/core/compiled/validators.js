"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMultiValidators = readMultiValidators;
var lucid_1 = require("@lucid-evolution/lucid");
function readMultiValidators(blueprint, params, policyIds) {
    var getValidator = function (title) {
        var validator = blueprint.validators.find(function (v) {
            return v.title === title;
        });
        if (!validator)
            throw new Error("Validator not found: ".concat(title));
        var script = (0, lucid_1.applyDoubleCborEncoding)(validator.compiledCode);
        if (params && policyIds) {
            script = (0, lucid_1.applyParamsToScript)(script, policyIds);
        }
        return {
            type: "PlutusV3",
            script: script,
        };
    };
    return {
        spendService: getValidator("service_multi_validator.service.spend"),
        mintService: getValidator("service_multi_validator.service.mint"),
        spendAccount: getValidator("account_multi_validator.account.spend"),
        mintAccount: getValidator("account_multi_validator.account.mint"),
        spendPayment: getValidator("payment_multi_validator.payment.spend"),
        mintPayment: getValidator("payment_multi_validator.payment.mint"),
        alwaysFails: getValidator("always_fails_validator.always_fails.else"),
    };
}
