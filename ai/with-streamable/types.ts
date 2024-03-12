import {
  inferActionRegistryInputs,
  inferActionRegistryOutputs,
} from "ai-actions";
import { ActionsRegistryWithStreamable } from ".";

export type TActionRegistryWithStreamable =
  typeof ActionsRegistryWithStreamable;
export type TActionWithStreamableId = keyof TActionRegistryWithStreamable;

export type TActionInputs =
  inferActionRegistryInputs<TActionRegistryWithStreamable>;
export type TActionOutputs =
  inferActionRegistryOutputs<TActionRegistryWithStreamable>;
