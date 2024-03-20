'use client';

import {
  TActionRegistriesContext,
  createUseActionRegistries,
} from 'ai-actions';
import { createContext, useContext } from 'react';
import { TAIActions } from './client';

// Create context
const Context = createContext<TActionRegistriesContext>(undefined);

// Create provider
export function ActionRegistriesProvider({
  actions,
  children,
}: {
  children: React.ReactNode;
  actions: TActionRegistriesContext;
}) {
  return <Context.Provider value={actions}>{children}</Context.Provider>;
}

// Create hook
export const useActionRegistries = createUseActionRegistries<TAIActions>(() =>
  useContext(Context),
);
