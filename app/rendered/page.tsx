import Chat from "@/components/chat";
import { RenderedActionsRegistry } from "@/lib/render-registry";
import { ClientSafeActionsRegistry } from "@/lib/shared/action-types";
import { StreamableActionsRegistry } from "@/lib/streamable-ui-registry";

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
