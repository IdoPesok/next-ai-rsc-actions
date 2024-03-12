import { createClientActionsRegistry } from "ai-actions";
import { ActionsRegistryWithStreamable } from ".";

export const ClientActionsRegistryWithStreamable = createClientActionsRegistry(
  ActionsRegistryWithStreamable,
  {
    pipeMetadata(metadata) {
      // we don't want to send the systemMessage to the client
      const { systemMessage, ...rest } = metadata;
      return rest;
    },
  }
);
