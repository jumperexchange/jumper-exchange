'use client';
import type { ThemeProps, ThemeState, ThemeStore } from '@/types/theme';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { createThemeStore } from './createThemeStore';
import type { StoreApi } from 'zustand';

export const ThemeStoreContext = createContext<StoreApi<ThemeState> | null>(
  null,
);

export const ThemeStoreProvider: React.FC<
  PropsWithChildren<{ value: ThemeProps }>
> = ({ children, value }) => {
  const store = useMemo(() => {
    return createThemeStore(value);
  }, [value]);

  return (
    <ThemeStoreContext.Provider value={store}>
      {children}
    </ThemeStoreContext.Provider>
  );
};

export function useThemeStore<T>(
  selector: (store: ThemeState) => T,
  equalityFunction = shallow,
) {
  const store = useContext(ThemeStoreContext);

  if (!store) {
    throw new Error(
      `You forgot to wrap your component in <${ThemeStoreProvider.name}>.`,
    );
  }

  return selector(store.getState());
}
