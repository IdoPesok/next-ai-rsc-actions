import { BotCard, BotMessage, Purchase } from "@/components/llm-stocks";
import { sleep } from "@/lib/utils";
import { z } from "zod";
import { createRenderedAction } from "../generators";

export const showStockPriceUIRenderedAction = createRenderedAction({
  id: "showStockPriceUI",
  metadata: {
    title: "Show Stock Price UI",
    description:
      "Show price and the UI to purchase a stock or currency. Use this if the user wants to purchase a stock or currency.",
    avatarGradient: "Yellow",
  },
})
  .describe(
    "Show price and the UI to purchase a stock or currency. Use this if the user wants to purchase a stock or currency."
  )
  .input({
    symbol: z
      .string()
      .describe(
        "The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD."
      ),
    price: z.number().describe("The price of the stock."),
    numberOfShares: z
      .number()
      .default(100)
      .describe(
        "The **number of shares** for a stock or currency to purchase. Can be optional if the user did not specify it."
      ),
  })
  .handler(() => {
    return;
  })
  .render(async function* ({ ...rest }) {
    const { input, context } = rest;
    const { aiState } = context;
    const { symbol, price, numberOfShares } = input;

    if (numberOfShares <= 0 || numberOfShares > 1000) {
      yield <BotMessage>Invalid amount</BotMessage>;
      aiState.done([
        ...aiState.get(),
        {
          role: "function",
          name: "showStockPriceUI",
          content: `[Invalid amount]`,
        },
      ]);
      return;
    }

    aiState.done([
      ...aiState.get(),
      {
        role: "function",
        name: "showStockPriceUI",
        content: `[UI for purchasing ${numberOfShares} shares of ${symbol}. Current price = ${price}, total cost = ${
          numberOfShares * price
        }]`,
      },
    ]);

    return (
      <>
        <BotMessage>
          Sure!{" "}
          {typeof numberOfShares === "number"
            ? `Click the button below to purchase ${numberOfShares} shares of $${symbol}:`
            : `How many $${symbol} would you like to purchase?`}
        </BotMessage>
        <BotCard showAvatar={false}>
          <Purchase {...input} price={+price} />
        </BotCard>
      </>
    );
  });
