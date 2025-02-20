'use client';
import { useAccount } from '@lifi/wallet-management';
import { useABTest } from 'src/hooks/useABTest';

export const AbTests = () => {
  const { account } = useAccount();

  useABTest({
    feature: 'test_widget_subvariants',
    user: account?.address || '',
  });
  return null;
};
