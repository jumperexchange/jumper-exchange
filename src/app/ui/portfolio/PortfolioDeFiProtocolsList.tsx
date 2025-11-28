import { DeFiPositionCard } from '@/components/composite/DeFiPositionCard/DeFiPositionCard';
import { DepositFlowModal } from '@/components/composite/DepositFlow/DepositFlow';
import { useFormatDisplayDeFiPositions } from '@/hooks/portfolio/useFormatDisplayDeFiPositions';
import { usePortfolioDeFiPositionsFiltering } from './PortfolioDeFiPositionsFilteringContext';
import { PortfolioEmptyList } from './PortfolioEmptyList';
import {
  PortfolioAssetContainer,
  PortfolioAssetsListContainer,
} from './PortfolioPage.styles';

export const PortfolioDeFiProtocolsList = () => {
  const { data, isEmpty, isLoading, clearFilters } =
    usePortfolioDeFiPositionsFiltering();

  const protocolGroups = useFormatDisplayDeFiPositions(
    data,
    (position) => `${position.protocol.name}-${position.chain.chainId}`,
  );

  if (isEmpty) {
    return null;
  }

  return (
    <>
      <PortfolioAssetsListContainer useFlexGap direction="column">
        {protocolGroups.length > 0 ? (
          protocolGroups.map((positions) => (
            <PortfolioAssetContainer
              key={`${positions[0].protocol.name}-${positions[0].chain.chainId}`}
            >
              <DeFiPositionCard
                defiPositions={positions}
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
