import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'default',
  },
};

export default async function QuestsLayout({ children }: PropsWithChildren) {
  return <Layout>{children}</Layout>;
}
