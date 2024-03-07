import { z } from "zod";
import { createStreamableUIAction } from "../generators";
import { BotCard, BotMessage, Purchase } from "@/components/llm-stocks";

export const showStockPriceUIStreamableAction = createStreamableUIAction({
  id: "showStockPriceUI",
  metadata: {
    title: "Show Stock Price UI",
    description:
      "Show price and the UI to purchase a stock or currency. Use this if the user wants to purchase a stock or currency.",
    avatarGradient: "Yellow",
    systemMessage:
      "If the user requests purchasing a stock, call `showStockPurchaseUI` to show the purchase UI.",
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
        numberOfShares: z
          .number()
          .default(100)
          .describe(
            "The **number of shares** for a stock or currency to purchase. Can be optional if the user did not specify it."
          ),
      })
      .describe(
        "Show price and the UI to purchase a stock or currency. Use this if the user wants to purchase a stock or currency."
      )
  )
  .setActionType("SERVER")
  .setOutputAsVoid()
  .setAuthType("None")
  .setActionFunction(async ({ input, context }) => {
    const { reply, aiState } = context;
    const { symbol, price, numberOfShares } = input;

    // we want to use done in normal mode, but append in super mode
    const fn = context.mode === "normal" ? reply.done : reply.append;

    // we want to use done in normal mode, but update in super mode
    const fn2 = context.mode === "normal" ? aiState.done : aiState.update;

    if (numberOfShares <= 0 || numberOfShares > 1000) {
      fn(<BotMessage>Invalid amount</BotMessage>);
      fn2([
        ...aiState.get(),
        {
          role: "function",
          name: "showStockPriceUI",
          content: `[Invalid amount]`,
        },
      ]);
      return;
    }

    fn(
      <>
        <BotMessage>
          Sure!{" "}
          {typeof numberOfShares === "number"
            ? `Click the button below to purchase ${numberOfShares} shares of $${symbol}:`
            : `How many $${symbol} would you like to purchase?`}
        </BotMessage>
        <BotCard showAvatar={false}>
          <Purchase
            defaultAmount={numberOfShares}
            name={symbol}
            price={+price}
          />
        </BotCard>
      </>
    );

    fn2([
      ...aiState.get(),
      {
        role: "function",
        name: "showStockPriceUI",
        content: `[UI for purchasing ${numberOfShares} shares of ${symbol}. Current price = ${price}, total cost = ${
          numberOfShares * price
        }]`,
      },
    ]);
  });
