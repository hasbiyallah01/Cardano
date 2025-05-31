import {
  mintingPolicyToId,
  Lucid,
  fromText,
  paymentCredentialOf,
  scriptFromNative,
  Blockfrost
} from "@lucid-evolution/lucid";



const lucid = await Lucid(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    "preprodz8ihSNx4Q47z4ABZfapm1JyrbO7bdLVg"
  ),
  "Preprod"
);
console.log("Lucid initialized successfully");
const address = await lucid.wallet().address();
const receiverAddress = "addr_test1qpycjgqth97fs8sqk35xt9wr98xmdawhuyjlgczprwp47zraxrptn5j75w4dtkrkkhdr6rewh42tkgfs5qezxem4h82q852yc8";

const mintingPolicy = scriptFromNative({
  type: "all",
  scripts: [
    { type: "sig", keyHash: paymentCredentialOf(address).hash },
  ],
});

const policyId = mintingPolicyToId(mintingPolicy);

const tx = await lucid
  .newTx()
  .mintAssets({
    [policyId + fromText("MyToken")]: 1n,
  })
  .pay.ToAddress(receiverAddress, { [policyId + fromText("MyToken")]: 1n })
  .validTo(Date.now() + 900000)
  .attach.MintingPolicy(mintingPolicy)
  .complete();
 
const signed = await tx.sign.withWallet().complete();
const txHash = await signed.submit();