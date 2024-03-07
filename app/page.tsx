import Chat from "@/components/chat";
import { ClientSafeActionsRegistry } from "@/ai/shared/action-types";
import { StreamableActionsRegistry } from "@/ai/streamable-ui-registry";

export default function Page() {
  const actions = Object.entries(StreamableActionsRegistry).reduce(
    (acc, [id, action]) => ({
      ...acc,
      [id]: {
        id,
        metadata: action.getMetadata(),
      },
    }),
    {} as ClientSafeActionsRegistry
  );

  return <Chat actions={actions} type="streamable" />;
}
