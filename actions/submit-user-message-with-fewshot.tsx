import { AI } from "@/ai";
import { ActionsRegistryWithRender } from "@/ai/with-render";
import { TActionIdWithRender } from "@/ai/with-render/types";
import { setupToolCalling } from "ai-actions";
import { getMutableAIState, render } from "ai/rsc";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function submitUserMessageWithRender(
  content: string,
  actionIds?: TActionIdWithRender[]
) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content,
    },
  ]);

  const { toolsWithRender, createFewShotToolCallMessages } = setupToolCalling(
    ActionsRegistryWithRender,
    {
      inArray: actionIds,
      context: {
        aiState,
      },
    }
  );

  const props: Parameters<typeof render>[0] = {
    model: "gpt-3.5-turbo",
    provider: openai,
    messages: [
      // type-safe few shot messages
      ...createFewShotToolCallMessages([
        {
          userMessageContent: "What is the stock price of AAPL?",
          tool_calls: [
            {
              name: "showStockPrice",
              arguments: {
                symbol: "AAPL",
              },
              response: {
                price: 100,
                delta: 1,
              },
            },
          ],
        },
        {
          userMessageContent: "I'd like to buy 10 shares of MSFT",
          tool_calls: [
            {
              name: "showStockPriceUI",
              arguments: {
                symbol: "AAPL",
                price: 100,
                numberOfShares: 10,
              },
            },
          ],
        },
      ]),
      { role: "user", content: content },
    ],
    text: ({ content, done }) => {
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content,
          },
        ]);
      }

      return <div>{content}</div>;
    },
    // now we can just pass our registry to the render function using `toolsWithRender`
    tools: toolsWithRender,
  };

  const ui = render(props);

  return {
    id: Date.now(),
    display: ui,
  };
}
