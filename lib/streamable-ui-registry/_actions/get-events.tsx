import { z } from "zod";
import { createStreamableUIAction } from "../generators";
import { BotCard } from "@/components/llm-stocks";
import { sleep } from "openai/core.mjs";
import { EventsSkeleton } from "@/components/llm-stocks/events-skeleton";
import { Events } from "@/components/llm-stocks/event";

export const getEventsStreamableAction = createStreamableUIAction({
  id: "getEvents",
  metadata: {
    title: "Get Events",
    description:
      "List funny imaginary events between user highlighted dates that describe stock activity.",
    avatarGradient: "Orange",
    systemMessage: "If you want to show events, call `getEvents`.",
  },
})
  .setInputSchema(
    z
      .object({
        events: z.array(
          z.object({
            date: z
              .string()
              .describe("The date of the event, in ISO-8601 format"),
            headline: z.string().describe("The headline of the event"),
            description: z.string().describe("The description of the event"),
          })
        ),
      })
      .describe(
        "List funny imaginary events between user highlighted dates that describe stock activity."
      )
  )
  .setActionType("SERVER")
  .setOutputAsVoid()
  .setAuthType("None")
  .setActionFunction(async ({ input, context }) => {
    const { reply, aiState } = context;
    const { events } = input;

    reply.update(
      <BotCard>
        <EventsSkeleton />
      </BotCard>
    );

    await sleep(1000);

    reply.done(
      <BotCard>
        <Events events={events} />
      </BotCard>
    );

    aiState.done([
      ...aiState.get(),
      {
        role: "function",
        name: "getEvents",
        content: JSON.stringify(events),
      },
    ]);
  });