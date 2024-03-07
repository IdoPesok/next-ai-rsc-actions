import { TRenderedActionId } from "../render-registry/types";
import { TStreamableActionId } from "../streamable-ui-registry/types";
import { TActionRegistryMetadata } from "./actions-metadata";

/**
 * When we pass the Actions registry to the client,
 * we must strip it away to only the id and metadata
 */

export type ClientSafeActionsRegistry = {
  [key in TStreamableActionId | TRenderedActionId]: {
    id: TStreamableActionId | TRenderedActionId;
    metadata: TActionRegistryMetadata;
  };
};
