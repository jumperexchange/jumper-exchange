import { useMemo } from 'react';
import type { ProjectData } from 'src/types/questDetails';
import { useZapData } from './useZapData';
import { useAccount } from '@lifi/wallet-management';
import type { Hex } from 'viem';
import { useGetZapInPoolBalance } from './useGetZapInPoolBalance';

export const useEnhancedZapData = (projectData: ProjectData) => {
  const { data, isSuccess } = useZapData({ projectData });
  const { account } = useAccount();

  const zapData = data?.data;
  const {
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    refetchDepositToken,
  } = useGetZapInPoolBalance(
    account.address as Hex,
    (projectData.tokenAddress as Hex) || (projectData.address as Hex),
    projectData.chainId,
  );

  return {
    zapData,
    isSuccess,
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    refetchDepositToken,
  };
};
