"use client";

import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

interface Props {
  children: React.ReactNode;
}

export function QueryProvider({ children }: Props) {
  const [client] = useState<QueryClient>(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  const persister = createSyncStoragePersister({ storage: typeof window !== 'undefined' ? window.localStorage : undefined });

  return (
    <PersistQueryClientProvider client={client} persistOptions={{ persister, buster: "v1" }}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </PersistQueryClientProvider>
  );
}
