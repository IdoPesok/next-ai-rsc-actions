import { AI } from "@/ai";
import { RenderedActionsRegistry } from "@/lib/render-registry";
import { TRenderedActionId } from "@/lib/render-registry/types";
import { setupToolCalling } from "ai-actions";
import { getMutableAIState, render } from "ai/rsc";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function submitUserMessageRendered(
  content: string,
  actionIds?: TRenderedActionId[]
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

  const props: Parameters<typeof render>[0] = {
    model: "gpt-3.5-turbo",
    provider: openai,
    messages: [{ role: "user", content: content }],
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
    tools: setupToolCalling(RenderedActionsRegistry, {
      inArray: actionIds,
      context: {
        aiState,
      },
    }).toolsWithRender,
  };

  const ui = render(props);

  return {
    id: Date.now(),
    display: ui,
  };
}
