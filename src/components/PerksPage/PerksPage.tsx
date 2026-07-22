'use client';

import { useAccount } from '@jumperexchange/wallet-management';
import { PageContainer } from '@/components/Containers/PageContainer';
import { ProfileProvider } from '@/providers/ProfileProvider';
import type { PerksDataAttributes } from '@/types/strapi';
import { PerksSection } from './PerksSection';

interface PerksPageProps {
  perks: PerksDataAttributes[];
}

export const PerksPage = ({ perks }: PerksPageProps) => {
  const { account } = useAccount();

  return (
    <ProfileProvider
      walletAddress={account?.address || ''}
      // @Note these flags are not correctly set in @jumperexchange/wallet-management
      isLoading={account?.isConnecting || account?.isReconnecting}
    >
      <PageContainer>
        <PerksSection perks={perks} />
      </PageContainer>
    </ProfileProvider>
  );
};
