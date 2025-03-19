'use client';
import { useAccount } from '@lifi/wallet-management';
import { AbTestCases } from 'src/const/abtests';
import { useABTest } from 'src/hooks/useABTest';

export const AbTests = () => {
  const { account } = useAccount();

  useABTest({
    feature: AbTestCases.TEST_WIDGET_SUBVARIANTS,
    user: account?.address || '',
  });
  return null;
};
