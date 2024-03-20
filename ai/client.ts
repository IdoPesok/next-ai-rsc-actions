import { prepareAIActions } from 'ai-actions';
import { ClientActionsRegistryWithRender } from './with-render/client';
import { ClientActionsRegistryWithStreamable } from './with-streamable/client';

// here we prepare the client registry for our provider
// note: we can add as many registries as we want here
export const AIActions = prepareAIActions([
  ClientActionsRegistryWithRender,
  ClientActionsRegistryWithStreamable,
]);
export type TAIActions = typeof AIActions;
