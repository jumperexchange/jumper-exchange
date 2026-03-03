import { ChainType } from '@lifi/sdk';
import { useChains } from '../useChains';
import { useMemo } from 'react';
import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';
import { THIRTY_MINUTES_MS } from '@/const/time';

export const useEarnByChainType = () => {
  const { chains } = useChains();
  const { accounts } = useAccount();

  const connectedAccounts = useMemo(() => {
    return accounts.filter((account) => account.address && account.isConnected);
  }, [accounts]);

  const connectedAccountsAddresses = useMemo(() => {
    return accounts.map((account) => account.address!);
  }, [accounts]);

  return useQuery({
    queryKey: ['useEarnByChainType', chains, connectedAccountsAddresses],
    queryFn: () => ({
      [ChainType.EVM]: {
        chains: chains.filter((chain) => chain.chainType === ChainType.EVM),
        account: connectedAccounts.find(
          (account) => account.chainType === ChainType.EVM,
        ),
      },
      [ChainType.SVM]: {
        chains: chains.filter((chain) => chain.chainType === ChainType.SVM),
        account: connectedAccounts.find(
          (account) => account.chainType === ChainType.SVM,
        ),
      },
    }),
    staleTime: THIRTY_MINUTES_MS,
  });
};
