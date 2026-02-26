'use client';
import type { FC, PropsWithChildren } from 'react';
import { useHydrated } from 'src/hooks/useHydrated';
import dynamic from 'next/dynamic';

const IntercomProviderInner = dynamic(
  () =>
    import('./IntercomProviderInner').then((mod) => mod.IntercomProviderInner),
  {
    ssr: false,
  },
);

export const IntercomProvider: FC<PropsWithChildren> = ({ children }) => {
  const hydrated = useHydrated();

  return (
    <>
      {hydrated && <IntercomProviderInner />}
      {children}
    </>
  );
};
