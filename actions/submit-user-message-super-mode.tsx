import "server-only";

import dedent from "dedent";
import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import OpenAI from "openai";

import { spinner, BotMessage, SystemMessage } from "@/components/llm-stocks";

import { runAsyncFnWithoutBlocking, sleep } from "@/lib/utils";
import { setupFunctionCalling } from "ai-actions";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { AI } from "@/ai";
import { ActionsRegistryWithStreamable } from "@/ai/with-streamable";
import { TActionWithStreamableId } from "@/ai/with-streamable/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

/**
 *
 * Super mode will write code and call functions to do the actions.
 *
 * NOTE: This is a demo and should not be used in production as executing LLM
 * written code is not safe without proper security checks and sandboxing.
 *
 * DO NOT USE THIS IN PRODUCTION
 * DO NOT USE THIS IN PRODUCTION
 * DO NOT USE THIS IN PRODUCTION
 * DO NOT USE THIS IN PRODUCTION
 * DO NOT USE THIS IN PRODUCTION
 *
 * Did I mention, DO NOT USE THIS IN PRODUCTION?
 *
 * The point of this is just to show what is possible when you call functions via
 * code vs. the typical tool calling API.
 *
 */

export async function submitUserMessageSuperMode(
  content: string,
  actionIds?: TActionWithStreamableId[]
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

  // create the streamable UI
  const reply = createStreamableUI(
    <BotMessage className="items-center">{spinner}</BotMessage>
  );

  // setup function calling
  const { functions, functionCallHandler } = setupFunctionCalling(
    ActionsRegistryWithStreamable,
    {
      inArray: actionIds, // only call the functions that are in the array (if any)
      context: {
        reply, // pass in the reply node as context for our functions
        aiState,
        mode: "superMode",
      },
    }
  );

  // create the messages
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: dedent`
        You are a stock trading simulation AI. Don't worry about fetching real time data, just use the functions given to you.

        Async Functions:
        ${functions.map((fn) => `${JSON.stringify(fn)}`).join("\n---\n")}

        Instructions:
        ${functions.map((fn) => `${ActionsRegistryWithStreamable[fn.name as TActionWithStreamableId].metadata.systemMessage}`).join("\n")}

        Besides that, you can also chat with users and do some calculations if needed.

        Use await to call the functions.
        
        You will write javascript code and call the functions to do the actions. You must write new code upon every user message.`,
    },
    {
      role: "user",
      content:
        "Show me the stock price of AAPL, DOGE, and BTC. Let's think step by step, then write the code with ```javascript",
    },
    {
      role: "assistant",
      content: dedent`
        In order to show the stock prices we can do this by calling the \`${ActionsRegistryWithStreamable["showStockPrice"].functionName}\` function with the correct arguments
        ${"```"}javascript
        const symbols = ["AAPL", "DOGE", "BTC"];

        await Promise.all(
          symbols.map(async (symbol) => {
            await showStockPrice({
              symbol,
              price: Math.round(Math.random() * 200 + 50),
              delta: Math.round(Math.random() * 40 - 20),
            });
          })
        );
        ${"```"}
      `,
    },
    ...aiState.get().map((info: any) => ({
      role: info.role,
      content: info.content,
      name: info.name,
    })),
  ];

  runAsyncFnWithoutBlocking(async () => {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages,
    });

    let functionAsString = ``;

    // inject in the function calling
    for (const systemFunction of functions.map((fn) => fn.name)) {
      const systemFunctionCode = dedent`
      async function ${systemFunction}(input) {
        await functionCallHandler({
          name: "${systemFunction}",
          arguments: input,
        });
      }
    `;
      functionAsString += "\n\n" + systemFunctionCode;
    }

    const finish = async () => {
      reply.done();
      aiState.done([...aiState.get()]);
    };

    // call the function
    try {
      // extract the javascript code
      let javascriptCode = completion.choices[0].message.content || "";
      javascriptCode = javascriptCode.split("```javascript")[1].split("```")[0];

      // create the main function wrapper
      functionAsString +=
        "\n\n" +
        dedent`
        const main = async () => {
          ${javascriptCode}

          finish()
        }

        main();
      `;

      // setup the function
      const callFunction = new Function(
        "functionCallHandler",
        "finish",
        `${functionAsString}`
      );

      reply.update(<SystemMessage>Executing parallel functions</SystemMessage>);
      await callFunction(functionCallHandler, finish);
    } catch (error) {
      reply.update(
        <BotMessage className="items-center text-red-500">
          Error executing parallel functions{" "}
          {error instanceof Error ? error.message : "unknown error"}
        </BotMessage>
      );
      finish();
    }
  });

  return {
    id: Date.now(),
    display: reply.value,
  };
}
