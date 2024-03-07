import { BotCard } from "@/components/llm-stocks";
import { Stock } from "@/components/llm-stocks/stock";
import { StockSkeleton } from "@/components/llm-stocks/stock-skeleton";
import { sleep } from "openai/core.mjs";
import { z } from "zod";
import { createRenderedAction } from "../generators";

export const showStockPriceRenderedAction = createRenderedAction({
  id: "showStockPrice",
  metadata: {
    title: "Show Stock Price",
    description:
      "Get the current stock price of a given stock or currency. Use this to show the price to the user.",
    avatarGradient: "Purple",
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
    console.log("running show stock price");
    await sleep(3000);
    console.log("finished running show stock price");
  })
  .setRenderFunction(async function* ({ actionFunction, ...rest }) {
    const { input, context } = rest;
    const { aiState } = context;
    const { symbol, price, delta } = input;

    yield (
      <BotCard>
        <StockSkeleton />
      </BotCard>
    );

    // we can call the action function from here
    // this is good if you want to keep your UI and action functions separate
    await actionFunction(rest);

    aiState.done([
      ...aiState.get(),
      {
        role: "function",
        name: "showStockPrice",
        content: `[Price of ${symbol} = ${price}]`,
      },
    ]);

    return (
      <BotCard>
        <Stock name={symbol} price={price} delta={delta} />
      </BotCard>
    );
  });
