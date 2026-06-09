import { PortfolioAssetsListContainer } from '../PortfolioPage.styles';
import { PortfolioTokens } from './PortfolioTokens';
import { PortfolioPositionsSection } from './PortfolioPositionsSection';
import { isChainPortfolioPosition } from '@/providers/PortfolioProvider/utils';
import type { PortfolioPosition } from '@/providers/PortfolioProvider/types';

const isDeFiPosition = (positions: PortfolioPosition[]) =>
  isChainPortfolioPosition(positions[0]);

const isPerpsPosition = (positions: PortfolioPosition[]) =>
  !isChainPortfolioPosition(positions[0]);

export const PortfolioHoldings = () => {
  return (
    <PortfolioAssetsListContainer useFlexGap direction="column">
      <PortfolioTokens />
      <PortfolioPositionsSection title="DeFi" filter={isDeFiPosition} />
      <PortfolioPositionsSection title="Perps" filter={isPerpsPosition} />
    </PortfolioAssetsListContainer>
  );
};
