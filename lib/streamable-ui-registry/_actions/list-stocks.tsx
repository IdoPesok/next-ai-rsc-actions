import { z } from "zod";
import { createStreamableUIAction } from "../generators";
import { BotCard } from "@/components/llm-stocks";
import { StocksSkeleton } from "@/components/llm-stocks/stocks-skeleton";
import { sleep } from "openai/core.mjs";
import { Stocks } from "@/components/llm-stocks/stocks";

export const listStocksStreamableAction = createStreamableUIAction({
  id: "listStocks",
  metadata: {
    title: "List Stocks",
    description: "List three imaginary stocks that are trending.",
    avatarGradient: "Blue",
    systemMessage:
      "If the user wants to show trending stocks, call `listStocks`",
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
    const { reply, aiState } = context;

    const fn = context.mode === "normal" ? reply.update : () => {};
    fn(
      <BotCard>
        <StocksSkeleton />
      </BotCard>
    );

    await sleep(1000);

    const fn2 = context.mode === "normal" ? reply.done : reply.append;
    fn2(
      <BotCard>
        <Stocks stocks={input.stocks} />
      </BotCard>
    );

    const fn3 = context.mode === "normal" ? aiState.done : aiState.update;
    fn3([
      ...aiState.get(),
      {
        role: "function",
        name: "listStocks",
        content: JSON.stringify(input.stocks),
      },
    ]);
  });
