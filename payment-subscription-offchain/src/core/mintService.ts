import {
  LucidEvolution,
  scriptFromNative,
  paymentCredentialOf,
  fromText,
  mintingPolicyToId
} from "@lucid-evolution/lucid"
export async function mintToken(
  lucid: LucidEvolution,
  privateKey: string,
  receiverAddress: string,
  tokenName: string,
  quantity: bigint = 1n
): Promise<string> {
  // Select wallet from private key
  console.log("picking wallet")
  lucid.selectWallet.fromPrivateKey(privateKey)
  
  // Create a simple minting policy (1-time signature-based)
  console.log("building script")
  const policy = scriptFromNative({
    type: "sig", 
    keyHash: paymentCredentialOf(await lucid.wallet().address()).hash ,
  });
  const policyId = mintingPolicyToId(policy);
  const assetName = fromText(tokenName);
  const unit = policyId + assetName;

  // Build minting transaction
  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: quantity })
    .pay.ToAddress(receiverAddress, { [unit]: quantity })
    .attach.MintingPolicy(policy)
    .complete();

  // Sign and submit transaction
  const signedTx = await tx.sign.withWallet().complete();
  const txHash = await signedTx.submit();

  return txHash;
}