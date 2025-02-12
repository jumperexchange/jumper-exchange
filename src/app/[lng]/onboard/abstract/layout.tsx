import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'abstract',
  },
};

export default async function InfosLayout({ children }: PropsWithChildren) {
  return <Layout>{children}</Layout>;
}
