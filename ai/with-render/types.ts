import {
  inferActionRegistryInputs,
  inferActionRegistryOutputs,
} from "ai-actions";
import { ActionsRegistryWithRender } from ".";

export type TActionRegistryWithRender = typeof ActionsRegistryWithRender;
export type TActionIdWithRender = keyof TActionRegistryWithRender;

export type TActionRegistryWithRenderInputs =
  inferActionRegistryInputs<TActionRegistryWithRender>;
export type TActionRegistryWithRenderOutputs =
  inferActionRegistryOutputs<TActionRegistryWithRender>;
