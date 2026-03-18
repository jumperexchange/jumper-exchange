'use client';
import type { FC, PropsWithChildren } from 'react';
import { useHydrated } from 'src/hooks/useHydrated';
import dynamic from 'next/dynamic';
import { useWebMetricComplete } from '@/hooks/useWebMetricComplete';

const IntercomProviderInner = dynamic(
  () =>
    import('./IntercomProviderInner').then((mod) => mod.IntercomProviderInner),
  {
    ssr: false,
  },
);

export const IntercomProvider: FC<PropsWithChildren> = ({ children }) => {
  const hydrated = useHydrated();
  const fcpDone = useWebMetricComplete('LCP');

  return (
    <>
      {hydrated && fcpDone && <IntercomProviderInner />}
      {children}
    </>
  );
};
