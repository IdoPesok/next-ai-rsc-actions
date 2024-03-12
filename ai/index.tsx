import "server-only";

import { createAI } from "ai/rsc";

import { confirmPurchase } from "@/actions/confirm-purchase";
import { submitUserMessageSuperMode } from "@/actions/submit-user-message-super-mode";
import { submitUserMessageWithStreamable } from "@/actions/submit-user-message-with-streamable";
import { submitUserMessageWithRender } from "@/actions/submit-user-message-with-render";

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
    submitUserMessageWithStreamable,
    confirmPurchase,
    submitUserMessageSuperMode,
    submitUserMessageWithRender,
  },
  initialUIState,
  initialAIState,
});
