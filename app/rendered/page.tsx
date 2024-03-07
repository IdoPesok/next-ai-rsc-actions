import Chat from "@/components/chat";
import { RenderedActionsRegistry } from "@/ai/render-registry";
import { ClientSafeActionsRegistry } from "@/ai/shared/action-types";
import { StreamableActionsRegistry } from "@/ai/streamable-ui-registry";

export default function Page() {
  const actions = Object.entries(RenderedActionsRegistry).reduce(
    (acc, [id, action]) => ({
      ...acc,
      [id]: {
        id,
        metadata: action.getMetadata(),
      },
    }),
    {} as ClientSafeActionsRegistry
  );

  return <Chat actions={actions} type="rendered" />;
}
