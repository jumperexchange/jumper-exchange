import { useMemo } from 'react';
import { ProjectData } from 'src/types/questDetails';
import { useZaps } from '../useZaps';
import { useAccount } from '@lifi/wallet-management';
import { Hex } from 'viem';
import { useGetZapInPoolBalance } from './useGetZapInPoolBalance';

export const useEnhancedZapData = (projectData: ProjectData) => {
  const { data, isSuccess } = useZaps(projectData);
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
