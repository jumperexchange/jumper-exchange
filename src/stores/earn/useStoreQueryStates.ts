'use client';
import { create } from 'zustand';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface QueryStateStoreType {
  query: string | undefined;
}

const earnSearchParamsStore = create<QueryStateStoreType>((set) => ({
  query: undefined,
}));

export const useEarnSearchParamsStorage = () =>
  earnSearchParamsStore((state) => state);

export const getEarnSearchParamsStorage = () => {
  return earnSearchParamsStore.getState();
};

export const useStoreEarnSearchParams = () => {
  const searchParams = useSearchParams();
  const route = usePathname();
  const { query } = useEarnSearchParamsStorage();

  useEffect(() => {
    if (route.match(/^\/[^/]+\/earn$/)) {
      earnSearchParamsStore.setState({ query: searchParams.toString() });
    }
  }, [query, searchParams, route]);
};
