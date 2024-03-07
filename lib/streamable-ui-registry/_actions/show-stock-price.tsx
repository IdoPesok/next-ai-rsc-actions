import { z } from "zod";
import { createStreamableUIAction } from "../generators";
import { BotCard } from "@/components/llm-stocks";
import { sleep } from "openai/core.mjs";
import { Stock } from "@/components/llm-stocks/stock";
import { StockSkeleton } from "@/components/llm-stocks/stock-skeleton";

export const showStockStreamablePriceAction = createStreamableUIAction({
  id: "showStockPrice",
  metadata: {
    title: "Show Stock Price",
    description:
      "Get the current stock price of a given stock or currency. Use this to show the price to the user.",
    avatarGradient: "Purple",
    systemMessage:
      "If the user wants just the price, call `showStockPrice` to show the price.",
  },
})
  .setInputSchema(
    z
      .object({
        symbol: z
          .string()
          .describe(
            "The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD."
          ),
        price: z.number().describe("The price of the stock."),
        delta: z.number().describe("The change in price of the stock"),
      })
      .describe(
        "Get the current stock price of a given stock or currency. Use this to show the price to the user."
      )
  )
  .setActionType("SERVER")
  .setOutputAsVoid()
  .setAuthType("None")
  .setActionFunction(async ({ input, context }) => {
    const { reply, aiState } = context;
    const { symbol, price, delta } = input;

    const fn = context.mode === "normal" ? reply.update : () => {};
    fn(
      <BotCard>
        <StockSkeleton />
      </BotCard>
    );

    await sleep(1000);

    // we want to use done in normal mode, but append in super mode
    const fn2 = context.mode === "normal" ? reply.done : reply.append;
    fn2(
      <BotCard>
        <Stock name={symbol} price={price} delta={delta} />
      </BotCard>
    );

    // we want to use done in normal mode, but update in super mode
    const fn3 = context.mode === "normal" ? aiState.done : aiState.update;
    fn3([
      ...aiState.get(),
      {
        role: "function",
        name: "showStockPrice",
        content: `[Price of ${symbol} = ${price}]`,
      },
    ]);

    if (context.mode === "superMode") {
      // sleep a random time between 10 and 20 seconds
      await sleep(Math.floor(Math.random() * 10) + 10);
    }
  });
