'use client';

import { createContext, PropsWithChildren } from 'react';

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
