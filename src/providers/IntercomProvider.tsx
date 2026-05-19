'use client';
import type { FC, PropsWithChildren } from 'react';
import { useHydrated } from 'src/hooks/useHydrated';
import dynamic from 'next/dynamic';
import { useWebMetricComplete } from '@/hooks/useWebMetricComplete';
import { useMenuStore } from 'src/stores/menu';

const IntercomProviderInner = dynamic(
  () =>
    import('./IntercomProviderInner').then((mod) => mod.IntercomProviderInner),
  {
    ssr: false,
  },
);

export const IntercomProvider: FC<PropsWithChildren> = ({ children }) => {
  const hydrated = useHydrated();
  const lcpDone = useWebMetricComplete('LCP');
  const intercomActivated = useMenuStore((state) => state.intercomActivated);

  const shouldInitIntercom = hydrated && lcpDone && intercomActivated;

  return (
    <>
      {shouldInitIntercom && <IntercomProviderInner />}
      {children}
    </>
  );
};
