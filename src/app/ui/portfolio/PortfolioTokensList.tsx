import { TokenListCard } from 'src/components/composite/TokenListCard/TokenListCard';
import { usePortfolioTokensFiltering } from './PortfolioTokensFilteringContext';
import { useMemo } from 'react';
import { TokenListCardTokenSize } from 'src/components/composite/TokenListCard/TokenListCard.types';
import {
  PortfolioAssetContainer,
  PortfolioAssetsListContainer,
} from './PortfolioPage.styles';

export const PortfolioTokensList = () => {
  const { data, filter } = usePortfolioTokensFiltering();

  const tokens = useMemo(() => {
    if (data?.length === 0) {
      return [];
    }

    return data.map((token) => ({
      address: token.address,
      symbol: token.symbol,
      chain: {
        chainId: token.chainId,
        chainKey: 'chainName' in token ? (token.chainName ?? '') : '',
      },
      balance: token.cumulatedBalance ?? 0,
      totalPriceUSD: token.cumulatedTotalUSD ?? 0,
      relatedTokens: token.chains.map((chain) => ({
        address: chain.address,
        symbol: chain.symbol,
        chain: {
          chainId: chain.chainId,
          chainKey: chain.chainName ?? '',
        },
        balance: chain.cumulatedBalance ?? 0,
        totalPriceUSD: chain.totalPriceUSD ?? 0,
      })),
    }));
  }, [data]);

  return (
    <PortfolioAssetsListContainer useFlexGap direction="column">
      {tokens.map((token) => (
        <PortfolioAssetContainer
          key={`${token.address}-${token.chain.chainId}`}
        >
          <TokenListCard size={TokenListCardTokenSize.MD} token={token} />
        </PortfolioAssetContainer>
      ))}
    </PortfolioAssetsListContainer>
  );
};
