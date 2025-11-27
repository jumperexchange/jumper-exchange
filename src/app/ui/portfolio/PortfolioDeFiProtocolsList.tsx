import { useMemo } from 'react';
import { DeFiPositionCard } from '@/components/composite/DeFiPositionCard/DeFiPositionCard';
import { usePortfolioDeFiPositionsFiltering } from './PortfolioDeFiPositionsFilteringContext';
import {
  PortfolioAssetContainer,
  PortfolioAssetsListContainer,
} from './PortfolioPage.styles';
import { DepositFlowModal } from '@/components/composite/DepositFlow/DepositFlow';
import { PortfolioEmptyList } from './PortfolioEmptyList';
import { groupBy } from 'lodash';
import { useFormatDisplayDeFiPositions } from '@/hooks/portfolio/useFormatDisplayDeFiPositions';

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
