import "server-only";

import { createAI } from "ai/rsc";

import { confirmPurchase } from "@/actions/confirm-purchase";
import { submitUserMessageSuperMode } from "@/actions/submit-user-message-super-mode";
import { submitUserMessageStreamable } from "@/actions/submit-user-message-create-streamable-ui";
import { submitUserMessageRendered } from "@/actions/submit-user-message-render";

// Define necessary types and create the AI.

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessageStreamable,
    confirmPurchase,
    submitUserMessageSuperMode,
    submitUserMessageRendered,
  },
  initialUIState,
  initialAIState,
});
