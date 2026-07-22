'use client';

import dynamic from 'next/dynamic';

const PerpsShell = dynamic(
  () => import('./PerpsShell').then((module) => module.PerpsShell),
  { ssr: false },
);

export function PerpsShellClient({ page }: { page: 'trade' | 'portfolio' }) {
  return <PerpsShell page={page} />;
}
