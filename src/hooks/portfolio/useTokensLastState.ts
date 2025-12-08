import { usePortfolioStore } from '@/stores/portfolio/PortfolioStore';
import { useAccount } from '@lifi/wallet-management';
import { sortBy } from 'lodash';
import { useMemo } from 'react';

export const useTokensLastState = () => {
  const { accounts } = useAccount();
  const getLast = usePortfolioStore((state) => state.getLast);

  const lastState = useMemo(() => {
    const states = accounts
      .filter((account) => account.isConnected && account.address)
      .map((account) => getLast(account.address!));

    sortBy(states, 'date').reverse();

    return states[0];
  }, [accounts, getLast]);

  return lastState;
};
