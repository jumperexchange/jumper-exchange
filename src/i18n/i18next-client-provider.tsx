'use client';

import type { PropsWithChildren } from 'react';
import { createContext } from 'react';

export const ClientTranslationContext = createContext({
  lng: '',
});

interface ClientTranslationProviderProps extends PropsWithChildren {
  lng: string;
}
export const ClientTranslationProvider = ({
  children,
  lng,
}: ClientTranslationProviderProps) => {
  return (
    <ClientTranslationContext.Provider value={{ lng }}>
      {children}
    </ClientTranslationContext.Provider>
  );
};
