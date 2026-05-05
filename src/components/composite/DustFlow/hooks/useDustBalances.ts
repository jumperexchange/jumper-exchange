import { useMemo } from 'react';
import { useChains } from '@/hooks/useChains';
import { useTokens } from '@/hooks/useTokens';
import { usePortfolioBalances } from '@/providers/PortfolioProvider/PortfolioContext';
import { createExtendedToken } from '@/types/tokens';
import { sortChainsByTotalNonNativeUsdDesc } from '../utils';

export const useDustBalances = () => {
  const { balances: portfolioBalances } = usePortfolioBalances();
  const { chains: allChains } = useChains();
  const { tokens: allTokens } = useTokens();

  const flatBalances = useMemo(
    () => Object.values(portfolioBalances ?? {}).flat(),
    [portfolioBalances],
  );

  const nonNativeBalances = useMemo(() => {
    if (!allTokens) {
      return [];
    }

    const nativeAddressByChainId = new Map(
      allChains.map((chain) => [
        chain.id,
        chain.nativeToken.address.toLowerCase(),
      ]),
    );

    return flatBalances.filter(
      (balance) =>
        nativeAddressByChainId.get(balance.token.chainId) !==
          balance.token.address.toLowerCase() && balance.amountUSD,
    );
  }, [flatBalances, allChains, allTokens]);

  const chains = useMemo(() => {
    const withDust = allChains.filter((chain) =>
      nonNativeBalances.some((b) => b.token.chainId === chain.id),
    );
    return sortChainsByTotalNonNativeUsdDesc(withDust, nonNativeBalances);
  }, [allChains, nonNativeBalances]);

  const nativeExtendedTokens = useMemo(() => {
    if (!allTokens) {
      return [];
    }

    return chains
      .flatMap((chain) => {
        const nativeToken = allTokens[chain.id]?.find(
          (token) =>
            token.address.toLowerCase() ===
            chain.nativeToken.address.toLowerCase(),
        );
        return nativeToken ? [nativeToken] : [];
      })
      .map((token) => createExtendedToken(token));
  }, [chains, allTokens]);

  return { flatBalances, nonNativeBalances, chains, nativeExtendedTokens };
};
