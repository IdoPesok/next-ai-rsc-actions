import { BotCard } from "@/components/llm-stocks";
import { Stocks } from "@/components/llm-stocks/stocks";
import { StocksSkeleton } from "@/components/llm-stocks/stocks-skeleton";
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
  .describe("List three imaginary stocks that are trending.")
  .input({
    stocks: z.array(
      z.object({
        symbol: z.string().describe("The symbol of the stock"),
        price: z.number().describe("The price of the stock"),
        delta: z.number().describe("The change in price of the stock"),
      })
    ),
  })
  // we can skip the handler and just render
  .noHandler()
  .render(async function* ({ ...rest }) {
    const { input, context } = rest;
    const { aiState } = context;

    yield (
      <BotCard>
        <StocksSkeleton />
      </BotCard>
    );

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
