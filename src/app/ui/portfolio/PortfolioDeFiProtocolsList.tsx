import { DeFiPositionCard } from '@/components/composite/DeFiPositionCard/DeFiPositionCard';
import { usePortfolioDeFiPositionsFiltering } from './PortfolioDeFiPositionsFilteringContext';
import {
  PortfolioAssetContainer,
  PortfolioAssetsListContainer,
} from './PortfolioPage.styles';
import { DepositFlowModal } from '@/components/composite/DepositFlow/DepositFlow';
import { useFormatDisplayDeFiPositionsData } from 'src/hooks/portfolio/useFormatDisplayDeFiPositionsData';

export const PortfolioDeFiProtocolsList = () => {
  const { data, isLoading } = usePortfolioDeFiPositionsFiltering();

  const defiPositions = useFormatDisplayDeFiPositionsData(data);
  return (
    <>
      <PortfolioAssetsListContainer useFlexGap direction="column">
        {defiPositions.map((defiPosition) => (
          <PortfolioAssetContainer key={defiPosition.slug}>
            <DeFiPositionCard
              defiPosition={defiPosition}
              isLoading={isLoading}
            />
          </PortfolioAssetContainer>
        ))}
      </PortfolioAssetsListContainer>
      <DepositFlowModal />
    </>
  );
};
