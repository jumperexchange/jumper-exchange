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

export const PortfolioDeFiProtocolsList = () => {
  const { data, isEmpty, isLoading, clearFilters } =
    usePortfolioDeFiPositionsFiltering();

  const groupByProtocolChain = useMemo(() => {
    const groupedData = groupBy(
      data,
      (position) => `${position.protocol.name}-${position.chain.chainId}`,
    );

    return Object.values(groupedData);
  }, [data]);

  if (isEmpty) {
    return null;
  }

  return (
    <>
      <PortfolioAssetsListContainer useFlexGap direction="column">
        {groupByProtocolChain.length > 0 ? (
          groupByProtocolChain.map((positions) => (
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
