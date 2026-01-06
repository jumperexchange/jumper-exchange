import { TokenListCard } from 'src/components/composite/TokenListCard/TokenListCard';
import { usePortfolioTokensFiltering } from './PortfolioTokensFilteringContext';
import { TokenListCardTokenSize } from 'src/components/composite/TokenListCard/TokenListCard.types';
import { PortfolioAssetsListContainer } from './PortfolioPage.styles';
import { useFormatDisplayWalletTokens } from '@/hooks/portfolio/useFormatDisplayWalletTokens';
import { PortfolioEmptyList } from './PortfolioEmptyList';
import { PortfolioAnimatedAssetContainer } from './PortfolioAnimatedAssetContainer';
import { TokenListCardSkeleton } from '@/components/composite/TokenListCard/TokenListCardSkeleton';
import { AnimatePresence } from 'motion/react';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import type { MinimalToken } from '@/types/tokens';
import { useRouter } from 'next/navigation';

export const PortfolioTokensList = () => {
  const { data, isLoading, isEmpty, clearFilters } =
    usePortfolioTokensFiltering();

  const tokens = useFormatDisplayWalletTokens(data);
  const totalValue = tokens.reduce(
    (acc, token) => acc + (token.totalPriceUSD ?? 0),
    0,
  );
  console.log('PortfolioTokensList - tokens', tokens);
  console.log('PortfolioTokensList - totalValue', totalValue);

  const router = useRouter();

  const setFrom = useWidgetCacheStore((state) => state.setFrom);

  const handleSelectToken = (token: MinimalToken) => {
    setFrom(token.address, token.chain.chainId);
    router.push('/');
  };

  if (isEmpty) {
    return null;
  }

  const renderContent = () => {
    if (isLoading && tokens.length === 0) {
      return Array.from({ length: 3 }).map((_, index) => (
        <PortfolioAnimatedAssetContainer key={index}>
          <TokenListCardSkeleton size={TokenListCardTokenSize.MD} />
        </PortfolioAnimatedAssetContainer>
      ));
    }

    if (tokens.length > 0) {
      return tokens.map((token, index) => (
        <PortfolioAnimatedAssetContainer
          key={`${token.address}-${token.chain.chainId}-${index}`}
        >
          <TokenListCard
            size={TokenListCardTokenSize.MD}
            token={token}
            onSelect={handleSelectToken}
          />
        </PortfolioAnimatedAssetContainer>
      ));
    }

    return (
      <PortfolioAnimatedAssetContainer>
        <PortfolioEmptyList onClearFilters={clearFilters} />
      </PortfolioAnimatedAssetContainer>
    );
  };

  return (
    <PortfolioAssetsListContainer useFlexGap direction="column">
      <AnimatePresence mode="popLayout">{renderContent()}</AnimatePresence>
    </PortfolioAssetsListContainer>
  );
};
