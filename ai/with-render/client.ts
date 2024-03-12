import { createClientActionsRegistry } from "ai-actions";
import { ActionsRegistryWithRender } from ".";

export const ClientActionsRegistryWithRender = createClientActionsRegistry(
  ActionsRegistryWithRender,
  {
    pipeMetadata(metadata) {
      return metadata;
    },
  }
);
