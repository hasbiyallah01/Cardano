import { expect, test } from "vitest";
import { Effect } from "effect";
import { LucidContext, makeLucidContext } from "./service/lucidContext.js";
import { BatchTestCase } from "./batch-serviceTest.js";

test<LucidContext>("Test 14 - Batch Service", async () => {
  const program = Effect.gen(function* (_) {
    const context = yield* makeLucidContext();
    const result = yield* BatchTestCase(context);
    return result;
  });

  const result = await Effect.runPromise(program);
  expect(result.txHash).toBeDefined();
  expect(typeof result.txHash).toBe("string");

  expect(result.batchConfig).toBeDefined();
});