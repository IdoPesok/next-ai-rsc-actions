import { z } from "zod";

export const ActionImageGradient = {
  Blue: "Blue",
  Green: "Green",
  Red: "Red",
  Yellow: "Yellow",
  Purple: "Purple",
  Orange: "Orange",
  Pink: "Pink",
} as const;

export const ActionsRegistryMetadata = z.object({
  title: z.string(),
  description: z.string(),
  systemMessage: z.string(),
  avatarGradient: z.nativeEnum(ActionImageGradient),
});

export type TActionRegistryMetadata = z.output<typeof ActionsRegistryMetadata>;
