"use client";

import {
  ActionRegistriesProviderWrapper,
  TActionRegistriesContext,
  createUseActionRegistries,
} from "ai-actions";
import { createContext, useContext } from "react";
import { ClientActionsRegistryWithStreamable } from "./with-streamable/client";
import { ClientActionsRegistryWithRender } from "./with-render/client";

const Registries = [
  ClientActionsRegistryWithStreamable,
  ClientActionsRegistryWithRender,
];

export const ActionRegistriesContext =
  createContext<TActionRegistriesContext>(undefined);

export function ActionRegistriesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ActionRegistriesProviderWrapper
      Context={ActionRegistriesContext}
      actionRegistries={Registries}
    >
      {children}
    </ActionRegistriesProviderWrapper>
  );
}

export const useActionRegistries = createUseActionRegistries(Registries, () =>
  useContext(ActionRegistriesContext)
);
