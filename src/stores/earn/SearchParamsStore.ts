'use client';
import { create } from 'zustand';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { type AppPaths } from '@/const/urls';
import { stripLocaleFromPathname } from '@/utils/urls/stripLocaleFromPathname';

interface QueryStateStoreType {
  query: Partial<Record<string, string | undefined>>;
}

const searchParamsStore = create<QueryStateStoreType>((set) => ({
  query: {},
}));

export const useSearchParamsStorage = () => searchParamsStore((state) => state);
export const useSearchParamsStorageFor = (appPath: AppPaths | string) =>
  searchParamsStore((state) => state.query[appPath]);

export const getSearchParamsStorage = () => {
  return searchParamsStore.getState();
};

export const useStoreSearchParams = () => {
  const searchParams = useSearchParams();
  const route = usePathname();

  useEffect(() => {
    const pathWithoutLocale = stripLocaleFromPathname(route);
    searchParamsStore.setState((state) => ({
      query: { ...state.query, [pathWithoutLocale]: searchParams.toString() },
    }));
  }, [searchParams, route]);
};
