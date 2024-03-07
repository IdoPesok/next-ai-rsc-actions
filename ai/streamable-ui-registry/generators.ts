import { generateActionRegistryFunctions } from "ai-actions";
import { createStreamableUI, createAI, getMutableAIState } from "ai/rsc";
import { z } from "zod";
import { ActionsRegistryMetadata } from "../shared/actions-metadata";

const { createStreamableUIAction, createStreamableUIActionsRegistry } =
  generateActionRegistryFunctions({
    namespace: "StreamableUI",
    actionFunctionContextSchema: z.object({
      reply: z.custom<ReturnType<typeof createStreamableUI>>(),
      aiState: z.custom<ReturnType<typeof getMutableAIState>>(),
      mode: z.literal("normal").or(z.literal("superMode")).default("normal"),
    }),
    metadataSchema: ActionsRegistryMetadata,
  });

export { createStreamableUIAction, createStreamableUIActionsRegistry };
