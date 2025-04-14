'use client';
import type { SettingsState, SettingsStore } from '@/types/settings';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { createSettingsStore } from './createSettingsStore';
import { useColorScheme, useMediaQuery } from '@mui/material';

export const SettingsStoreContext = createContext<SettingsStore | null>(null);

export const SettingsStoreProvider: React.FC<
  PropsWithChildren<{ welcomeScreenClosed: boolean }>
> = ({ children, welcomeScreenClosed }) => {
  const storeRef = useRef<SettingsStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createSettingsStore({ welcomeScreenClosed });
  }


  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const { mode, setMode } = useColorScheme();

  console.log('---', mode)
  useEffect(() => {
    console.log('setmode', mode, setMode)
    if (mode) {
      return;
    }

    console.log('testtt')


    setMode('light');

  }, []);

  useEffect(() => {
    console.log('current mode:', mode)
  }, [mode]);

  console.log('--ergfd', mode)


  if (!mode) {
    return <div>prefersDarkMode: {prefersDarkMode.toString()}</div>;
  }

  return (
    <SettingsStoreContext.Provider value={storeRef.current}>
      {children}
    </SettingsStoreContext.Provider>
  );
};

export function useSettingsStore<T>(
  selector: (store: SettingsState) => T,
  equalityFunction = shallow,
) {
  const useStore = useContext(SettingsStoreContext);

  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${SettingsStoreProvider.name}>.`,
    );
  }

  return useStore(selector, equalityFunction);
}
