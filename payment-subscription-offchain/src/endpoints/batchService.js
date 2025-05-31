"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var lucid_1 = require("@lucid-evolution/lucid");
var lucid = await (0, lucid_1.Lucid)(new lucid_1.Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", "preprodz8ihSNx4Q47z4ABZfapm1JyrbO7bdLVg"), "Preprod");
console.log("Lucid initialized successfully");
var address = await lucid.wallet().address();
var receiverAddress = "addr_test1qpycjgqth97fs8sqk35xt9wr98xmdawhuyjlgczprwp47zraxrptn5j75w4dtkrkkhdr6rewh42tkgfs5qezxem4h82q852yc8";
var mintingPolicy = (0, lucid_1.scriptFromNative)({
    type: "all",
    scripts: [
        { type: "sig", keyHash: (0, lucid_1.paymentCredentialOf)(address).hash },
    ],
});
var policyId = (0, lucid_1.mintingPolicyToId)(mintingPolicy);
var tx = await lucid
    .newTx()
    .mintAssets((_a = {},
    _a[policyId + (0, lucid_1.fromText)("MyToken")] = 1n,
    _a))
    .pay.ToAddress(receiverAddress, (_b = {}, _b[policyId + (0, lucid_1.fromText)("MyToken")] = 1n, _b))
    .validTo(Date.now() + 900000)
    .attach.MintingPolicy(mintingPolicy)
    .complete();
var signed = await tx.sign.withWallet().complete();
var txHash = await signed.submit();
