import { TokenListCard } from 'src/components/composite/TokenListCard/TokenListCard';
import { usePortfolioTokensFiltering } from './PortfolioTokensFilteringContext';
import { TokenListCardTokenSize } from 'src/components/composite/TokenListCard/TokenListCard.types';
import {
  PortfolioAssetContainer,
  PortfolioAssetsListContainer,
} from './PortfolioPage.styles';
import { useFormatDisplayWalletTokens } from '@/hooks/portfolio/useFormatDisplayWalletTokens';
import { PortfolioEmptyList } from './PortfolioEmptyList';

export const PortfolioTokensList = () => {
  const { data, isEmpty, clearFilters } = usePortfolioTokensFiltering();

  const tokens = useFormatDisplayWalletTokens(data);

  if (isEmpty) {
    return null;
  }

  return (
    <PortfolioAssetsListContainer useFlexGap direction="column">
      {tokens.length > 0 ? (
        tokens.map((token) => (
          <PortfolioAssetContainer
            key={`${token.address}-${token.chain.chainId}`}
          >
            <TokenListCard size={TokenListCardTokenSize.MD} token={token} />
          </PortfolioAssetContainer>
        ))
      ) : (
        <PortfolioAssetContainer>
          <PortfolioEmptyList onClearFilters={clearFilters} />
        </PortfolioAssetContainer>
      )}
    </PortfolioAssetsListContainer>
  );
};
