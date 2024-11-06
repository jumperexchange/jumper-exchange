'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { ReactNode } from 'react';
import type { DefaultOptions } from '@tanstack/react-query';

import { RoycoContext } from './RoycoContext';

interface RoycoProviderProps {
  children: ReactNode;
  originUrl: string;
  originKey: string;
  defaultOptions?: DefaultOptions;
}

const RoycoProvider = ({
  children,
  originUrl,
  originKey,
  defaultOptions = {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: 1000,
      refetchIntervalInBackground: true,
      refetchOnReconnect: true,
    },
  },
}: RoycoProviderProps): React.ReactElement => {
  const value = { originUrl, originKey };

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: defaultOptions,
      }),
  );

  return (
    <RoycoContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RoycoContext.Provider>
  );
};

export { RoycoProvider };
export type { RoycoProviderProps };
