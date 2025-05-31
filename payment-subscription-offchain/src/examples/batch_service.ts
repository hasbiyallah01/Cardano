import {
    BatchConfig,
    BatchSub,
    LucidEvolution,
} from "../index.js";
import { makeLucidContext } from "./lucid.js";

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;

const BatchAddition = async (
    lucid: LucidEvolution,
    productName: string,
    batchId: string,
    units: bigint,
    ingredients: string[],
    manufacturer: string,
    productionDate: string,
    expiryDate: string
): Promise<Error | void> => {
    const batchConfig: BatchConfig = {
        productName : productName,
        batchId : batchId,
        units : units,
        ingredients : ingredients,
        manufacturer : manufacturer,
        productionDate : productionDate,
        expiryDate : expiryDate
    };

    try {
        const initBatchUnsigned = await BatchSub(lucid, batchConfig);
        const initBatchSigned = await initBatchUnsigned.sign
            .withWallet()
            .complete();
        const initBatchHash = await initBatchSigned.submit();

        console.log(`Submitting ...`);
        await lucid.awaitTx(initBatchHash);

        console.log(
            `Subscription initiated successfully: ${initBatchHash}`,
        );
    } catch (error) {
        console.error("Failed to initiate subscription:", error);
    }
};

const lucidContext = await makeLucidContext()
const lucid = lucidContext.lucid
lucid.selectWallet.fromSeed(lucidContext.users.subscriber.seedPhrase)
await BatchAddition(lucid, "Segun", "001" , 11n, ["sugar", "water"], "hasbiy", "5/30/25", "5/30/26 ")
