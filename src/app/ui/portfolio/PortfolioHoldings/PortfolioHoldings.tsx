import { PortfolioAssetsListContainer } from '../PortfolioPage.styles';
import { PortfolioTokenHoldings } from './PortfolioTokenHoldings';
import { PortfolioPositionHoldings } from './PortfolioPositionHoldings';
import { isChainPortfolioPosition } from '@/providers/PortfolioProvider/utils';
import type { PortfolioPosition } from '@/providers/PortfolioProvider/types';
import { useTranslation } from 'react-i18next';

const isDeFiPosition = (positions: PortfolioPosition[]) =>
  isChainPortfolioPosition(positions[0]);

const isPerpsPosition = (positions: PortfolioPosition[]) =>
  !isChainPortfolioPosition(positions[0]);

export const PortfolioHoldings = () => {
  const { t } = useTranslation();

  return (
    <PortfolioAssetsListContainer useFlexGap direction="column">
      <PortfolioTokenHoldings title={t('portfolio.holdings.tokens')} />
      <PortfolioPositionHoldings
        title={t('portfolio.holdings.defiPositions')}
        filter={isDeFiPosition}
      />
      <PortfolioPositionHoldings
        title={t('portfolio.holdings.perps')}
        filter={isPerpsPosition}
      />
    </PortfolioAssetsListContainer>
  );
};
