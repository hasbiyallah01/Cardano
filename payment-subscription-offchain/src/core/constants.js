"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_TOKEN_NAME = exports.REF_SCRIPT_TOKEN_NAMES = exports.ADA = exports.PROTOCOL_STAKE_KEY = exports.PROTOCOL_PAYMENT_KEY = exports.TIME_TOLERANCE_MS = exports.PROTOCOL_FEE = exports.TWENTY_FOUR_HOURS_MS = exports.TWO_YEARS_MS = exports.ONE_YEAR_MS = exports.ONE_HOUR_MS = void 0;
exports.ONE_HOUR_MS = 3600000;
exports.ONE_YEAR_MS = 31557600000;
exports.TWO_YEARS_MS = 2 * exports.ONE_YEAR_MS;
exports.TWENTY_FOUR_HOURS_MS = 24 * exports.ONE_HOUR_MS;
exports.PROTOCOL_FEE = 0.05;
exports.TIME_TOLERANCE_MS = process.env.NODE_ENV == "emulator"
    ? 0
    : 100000;
exports.PROTOCOL_PAYMENT_KEY = "014e9d57e1623f7eeef5d0a8d4e6734a562ba32cf910244cd74e1680";
exports.PROTOCOL_STAKE_KEY = "5e8aa3f089868eaadf188426f49db6566624844b6c5d529b38f3b8a7";
exports.ADA = {
    policyId: "",
    assetName: "",
};
exports.REF_SCRIPT_TOKEN_NAMES = {
    spendService: "SpendService",
    mintService: "MintService",
    spendAccount: "SpendAccount",
    mintAccount: "MintAccount",
    spendPayment: "SpendPayment",
    mintPayment: "MintPayment",
};
exports.PAYMENT_TOKEN_NAME = "subscription";
