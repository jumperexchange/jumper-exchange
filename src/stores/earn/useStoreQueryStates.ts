'use client';
import { create } from 'zustand';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

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
  const { query } = useEarnSearchParamsStorage();

  useEffect(() => {
    earnSearchParamsStore.setState({ query: searchParams.toString() });
  }, [query, searchParams]);
};
