import { BotCard } from "@/components/llm-stocks";
import { Events } from "@/components/llm-stocks/event";
import { EventsSkeleton } from "@/components/llm-stocks/events-skeleton";
import { sleep } from "openai/core.mjs";
import { z } from "zod";
import { createRenderedAction } from "../generators";

export const getEventsRenderedAction = createRenderedAction({
  id: "getEvents",
  metadata: {
    title: "Get Events",
    description:
      "List funny imaginary events between user highlighted dates that describe stock activity.",
    avatarGradient: "Orange",
  },
})
  .describe(
    "List funny imaginary events between user highlighted dates that describe stock activity."
  )
  .input({
    events: z.array(
      z.object({
        date: z.string().describe("The date of the event, in ISO-8601 format"),
        headline: z
          .string()
          .describe("The headline of the event")
          .transform((headline) => headline.slice(0, 30) + "!!"), // we can use transform
        description: z.string().describe("The description of the event"),
      })
    ),
  })
  .handler(async ({ input, context }) => {
    console.log("running get events");
    await sleep(1000);
    console.log("done running get events");
  })
  .render(async function* ({ handler, ...rest }) {
    const { input, context } = rest;
    const { aiState } = context;

    yield (
      <BotCard>
        <EventsSkeleton />
      </BotCard>
    );

    // we can call the action function from here
    // this is good if you want to keep your UI and action functions separate
    await handler(rest);

    aiState.done([
      ...aiState.get(),
      {
        role: "function",
        name: "getEvents",
        content: JSON.stringify(input.events),
      },
    ]);

    return (
      <BotCard>
        <Events events={input.events} />
      </BotCard>
    );
  });
