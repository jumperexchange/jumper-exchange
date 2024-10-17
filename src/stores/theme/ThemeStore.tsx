import type { ThemeProps, ThemeState, ThemeStore } from '@/types/theme';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { createThemeStore } from './createThemeStore';

export const ThemeStoreContext = createContext<ThemeStore | null>(null);

export const ThemeStoreProvider: React.FC<
  PropsWithChildren<{ value: ThemeProps }>
> = ({ children, value }) => {
  const storeRef = useRef<ThemeStore>();

  if (!storeRef.current) {
    storeRef.current = createThemeStore(value);
  }

  return (
    <ThemeStoreContext.Provider value={storeRef.current}>
      {children}
    </ThemeStoreContext.Provider>
  );
};

export function useThemeStore<T>(
  selector: (store: ThemeState) => T,
  equalityFunction = shallow,
) {
  const useStore = useContext(ThemeStoreContext);

  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${ThemeStoreProvider.name}>.`,
    );
  }

  return useStore(selector, equalityFunction);
}
