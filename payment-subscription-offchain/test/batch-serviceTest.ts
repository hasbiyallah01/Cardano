import {
  BatchConfig
} from "../src/index.js";
import { Effect } from "effect";
import { LucidContext } from "./service/lucidContext.js";
import { batchServiceProgram } from "../src/endpoints/batchService.js";

type BatchTestResult = {
  txHash: string;
  batchConfig: BatchConfig;
};

export const BatchTestCase = (
  { lucid, users }: LucidContext,
): Effect.Effect<BatchTestResult, Error, never> => {
  return Effect.gen(function* (_) {
    const productName = "TestProduct";
    const batchId = "BATCH001";
    const units = 20n;
    const ingredients = ["sugar", "salt"];
    const manufacturer = "Hasbiy Industries";
    const productionDate = "2025-05-30";
    const expiryDate = "2026-05-30"; 

    lucid.selectWallet.fromSeed(users.subscriber.seedPhrase);

    const batchConfig : BatchConfig = {
      productName,
      batchId,
      units,
      ingredients,
      manufacturer,
      productionDate,
      expiryDate,
    };

    const initBatchFlow = Effect.gen(function* (_) {
      const batchUnsignedTx = yield* batchServiceProgram(
        lucid, 
        batchConfig
    );
      const batchSignedTx = yield* Effect.promise(() =>
        batchUnsignedTx.sign.withWallet().complete()
      );
      const batchtxHash = yield* Effect.promise(() => 
        batchSignedTx.submit());
      console.log("Batch Submission Hash:", batchtxHash);
      return batchtxHash;
    });


    const batchtxHash = yield* initBatchFlow.pipe(
      Effect.tapError((err) =>
        Effect.log(`BatchServiceProgram error: ${err}`)
      ),
       Effect.map((hash) => {
                return hash;
        }),
    );

    return {
      txHash : batchtxHash,
      batchConfig,
    };
  });
};
