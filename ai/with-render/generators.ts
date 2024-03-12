import { generateActionRegistryFunctions } from "ai-actions";
import { createStreamableUI, createAI, getMutableAIState } from "ai/rsc";
import { z } from "zod";
import { ActionsRegistryMetadata } from "../shared/actions-metadata";

const { createRenderedAction, createRenderedActionsRegistry } =
  generateActionRegistryFunctions({
    namespace: "Rendered",
    handlerContextSchema: z.object({
      aiState: z.custom<ReturnType<typeof getMutableAIState>>(),
    }),
    metadataSchema: ActionsRegistryMetadata.omit({
      systemMessage: true,
    }),
  });

export { createRenderedAction, createRenderedActionsRegistry };
