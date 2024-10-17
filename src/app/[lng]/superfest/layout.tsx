import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'op',
  },
};

export default async function SuperfestLayout({ children }: PropsWithChildren) {
  return <Layout>{children}</Layout>;
}
