import { DeFiPositionCard } from '@/components/composite/DeFiPositionCard/DeFiPositionCard';
import { usePortfolioDeFiPositionsFiltering } from './PortfolioDeFiPositionsFilteringContext';
import {
  PortfolioAssetContainer,
  PortfolioAssetsListContainer,
} from './PortfolioPage.styles';
import { DepositFlowModal } from '@/components/composite/DepositFlow/DepositFlow';
import { PortfolioEmptyList } from './PortfolioEmptyList';
import { useFormatDisplayDeFiPositionsData } from 'src/hooks/portfolio/useFormatDisplayDeFiPositionsData';

export const PortfolioDeFiProtocolsList = () => {
  const { data, isEmpty, isLoading, clearFilters } =
    usePortfolioDeFiPositionsFiltering();

  const defiPositions = useFormatDisplayDeFiPositionsData(data);

  if (isEmpty) {
    return null;
  }

  return (
    <>
      <PortfolioAssetsListContainer useFlexGap direction="column">
        {defiPositions.length > 0 ? (
          defiPositions.map((defiPosition) => (
            <PortfolioAssetContainer key={defiPosition.slug}>
              <DeFiPositionCard
                defiPosition={defiPosition}
                isLoading={isLoading}
              />
            </PortfolioAssetContainer>
          ))
        ) : (
          <PortfolioAssetContainer>
            <PortfolioEmptyList onClearFilters={clearFilters} />
          </PortfolioAssetContainer>
        )}
      </PortfolioAssetsListContainer>
      <DepositFlowModal />
    </>
  );
};
