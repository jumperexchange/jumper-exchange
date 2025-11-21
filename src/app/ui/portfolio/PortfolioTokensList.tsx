import { TokenListCard } from 'src/components/composite/TokenListCard/TokenListCard';
import { usePortfolioTokensFiltering } from './PortfolioTokensFilteringContext';
import { TokenListCardTokenSize } from 'src/components/composite/TokenListCard/TokenListCard.types';
import {
  PortfolioAssetContainer,
  PortfolioAssetsListContainer,
} from './PortfolioPage.styles';
import { useFormatDisplayWalletTokens } from '@/hooks/portfolio/useFormatDisplayWalletTokens';

export const PortfolioTokensList = () => {
  const { data, filter } = usePortfolioTokensFiltering();

  const tokens = useFormatDisplayWalletTokens(data);

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
