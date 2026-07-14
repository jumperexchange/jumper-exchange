'use client';
import { DustFlow } from '@/components/composite/DustFlow/DustFlow';
import { AB_TEST_NAME } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';
import { useAccount } from '@jumperexchange/wallet-management';

export const PortfolioDustSection = () => {
  const { account } = useAccount();
  const dustConversionFeatureFlag = useABTest({
    feature: AB_TEST_NAME.DUST_CONVERSION,
    address: account?.address ?? '',
  });

  if (
    dustConversionFeatureFlag.isLoading ||
    !dustConversionFeatureFlag.isEnabled ||
    !dustConversionFeatureFlag.value
  ) {
    return null;
  }
  return <DustFlow />;
};
