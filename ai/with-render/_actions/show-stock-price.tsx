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
  .describe(
    "Get the current stock price of a given stock or currency. Use this to show the price to the user."
  )
  .input({
    symbol: z
      .string()
      .default("DOGE")
      .describe(
        "The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD."
      ),
  })
  .handler(async ({ input, context }) => {
    console.log("running show stock price");
    await sleep(3000);
    console.log("finished running show stock price");

    return {
      price: Math.round(Math.random() * 200 + 50),
      delta: Math.round(Math.random() * 40 - 20),
    };
  })
  .render(async function* ({ handler, ...rest }) {
    const { input, context } = rest;
    const { aiState } = context;
    const { symbol } = input;

    yield (
      <BotCard>
        <StockSkeleton />
      </BotCard>
    );

    // we can call the handler from here
    // this is good if you want to keep your UI and action functions separate
    // note: we can also just put the "function" code in the render function
    const { price, delta } = await handler(rest);

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
        <Stock {...input} price={price} delta={delta} />
      </BotCard>
    );
  });
