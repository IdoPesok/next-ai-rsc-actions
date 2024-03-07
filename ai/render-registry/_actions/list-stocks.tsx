import { BotCard } from "@/components/llm-stocks";
import { Stocks } from "@/components/llm-stocks/stocks";
import { StocksSkeleton } from "@/components/llm-stocks/stocks-skeleton";
import { sleep } from "openai/core.mjs";
import { z } from "zod";
import { createRenderedAction } from "../generators";

export const listStocksRenderedAction = createRenderedAction({
  id: "listStocks",
  metadata: {
    title: "List Stocks",
    description: "List three imaginary stocks that are trending.",
    avatarGradient: "Blue",
  },
})
  .setInputSchema(
    z
      .object({
        stocks: z.array(
          z.object({
            symbol: z.string().describe("The symbol of the stock"),
            price: z.number().describe("The price of the stock"),
            delta: z.number().describe("The change in price of the stock"),
          })
        ),
      })
      .describe("List three imaginary stocks that are trending.")
  )
  .setActionType("SERVER")
  .setOutputAsVoid()
  .setAuthType("None")
  .setActionFunction(async ({ input, context }) => {
    console.log("running list stocks");
    await sleep(3000);
    console.log("done running list stocks");
  })
  .setRenderFunction(async function* ({ actionFunction, ...rest }) {
    const { input, context } = rest;
    const { aiState } = context;

    yield (
      <BotCard>
        <StocksSkeleton />
      </BotCard>
    );

    // we can call the action function from here
    // this is good if you want to keep your UI and action functions separate
    await actionFunction(rest);

    aiState.done([
      ...rest.context.aiState.get(),
      {
        role: "function",
        name: "listStocks",
        content: JSON.stringify(input.stocks),
      },
    ]);

    return (
      <BotCard>
        <Stocks stocks={input.stocks} />
      </BotCard>
    );
  });
