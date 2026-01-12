'use client';
import { create } from 'zustand';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { AppPaths } from '@/const/urls';

interface QueryStateStoreType {
  query: Partial<Record<AppPaths, string | undefined>>;
}

const searchParamsStore = create<QueryStateStoreType>((set) => ({
  query: {},
}));

export const useSearchParamsStorage = () => searchParamsStore((state) => state);
export const useSearchParamsStorageFor = (appPath: AppPaths) =>
  searchParamsStore((state) => state).query[appPath];

export const getSearchParamsStorage = () => {
  return searchParamsStore.getState();
};

export const useStoreSearchParams = () => {
  const searchParams = useSearchParams();
  const route = usePathname();

  useEffect(() => {
    const routeMatch = route.match(/^\/[a-zA-Z]+(\/[a-zA-Z]+)$/);
    if (routeMatch) {
      const pagePath = routeMatch[1];
      const isValidPagePath = pagePath in AppPaths;
      if (!isValidPagePath) {
        throw new Error('Invalid page path for storing search params');
      }
      searchParamsStore.setState((state) => ({
        query: { ...state.query, [pagePath]: searchParams.toString() },
      }));
    } else {
      throw new Error('Invalid page path for storing search params');
    }
  }, [searchParams, route]);
};
