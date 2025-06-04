const { Blockfrost, Lucid } = require("@lucid-evolution/lucid");

async function main() {
    const lucid = await Lucid(
        new Blockfrost(
            "https://cardano-preprod.blockfrost.io/api/v0",
            "preprod5qwg7OFpvFxUJnZeAjcT8DDMwNo8Nxvl"
        ),
        "Preprod"
    );
    const address = "addr_test1vz7lzkzs0p83radee95g8k9nuz0c9h89t8z63cg5fhsrymqs4v4pd";
    const utxos = await lucid.utxosAt(address);
    lucid.selectWallet.fromAddress(address, utxos);

    const sender = lucid.selectWallet.fromAddress(address, utxos);

    const tx = await lucid
        .newTx()
        .pay.ToAddress("addr_test1vrc5wycmed8jk9cgzxlaj8lw3vdtgk606e4ftncp5tzcepstss0wu", { lovelace: 10000n })
        .complete();

    const signedTx = await tx.sign.withWallet().complete();
    const txHash = await signedTx.submit();
    console.log(txHash);
}

main().catch(console.error);