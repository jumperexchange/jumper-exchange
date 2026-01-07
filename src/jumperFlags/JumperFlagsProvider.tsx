'use client';

import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useQuery } from '@tanstack/react-query';
import { createContext, type ReactNode, useMemo } from 'react';
import type { JumperFlags, JumperFlagsContextValue } from './types';

export const JumperFlagsContext = createContext<JumperFlagsContextValue>({
  flags: null,
  isLoading: false,
  error: null,
});

interface JumperFlagsProviderProps {
  children: ReactNode;
}

export const JumperFlagsProvider = ({ children }: JumperFlagsProviderProps) => {
  const accountAddress = useAccountAddress();

  const { data, isLoading, error } = useQuery<JumperFlags>({
    queryKey: ['jumperFlags', accountAddress],
    queryFn: async () => {
      const response = await fetch(`/api/profile/${accountAddress}/flags`);

      if (!response.ok) {
        throw new Error('Failed to fetch wallet flags');
      }

      return response.json();
    },
    enabled: !!accountAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const value = useMemo<JumperFlagsContextValue>(
    () => ({
      flags: data ?? null,
      isLoading,
      error: error as Error | null,
    }),
    [data, isLoading, error],
  );

  return (
    <JumperFlagsContext.Provider value={value}>
      {children}
    </JumperFlagsContext.Provider>
  );
};
