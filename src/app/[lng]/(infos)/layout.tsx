import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';
import { ProfileProvider } from '../../../providers/ProfileProvider';
import { useAccount } from '@lifi/wallet-management';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'default',
  },
};

export default async function InfosLayout({ children }: PropsWithChildren) {
  return <Layout>{children}</Layout>;
}
