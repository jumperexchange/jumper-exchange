import { useMemo } from 'react';
import { mapValues, pickBy } from 'lodash';
import { usePositionsFiltering } from '@/providers/PortfolioProvider/filtering/PositionsFilteringContext';
import { usePortfolioSummary } from '@/providers/PortfolioProvider/PortfolioContext';
import { hasPositionDataToDisplay } from '@/components/composite/PositionCard/utils';
import { PositionSummaryRow } from '@/components/composite/PositionCard/components/PositionSummaryRow';
import type { PortfolioPosition } from '@/providers/PortfolioProvider/types';
import type { FC } from 'react';
import { PortfolioHoldingsSection } from './PortfolioHoldingsSection';
import { HoldingItemRow } from './HoldingItemRow';
import { useHoldingAmountProgress } from './useHoldingAmountProgress';

interface PortfolioPositionsSectionProps {
  title: string;
  filter: (positions: PortfolioPosition[]) => boolean;
}

const getPositionValue = (position: PortfolioPosition) => position.netUsd;

export const PortfolioPositionsSection: FC<PortfolioPositionsSectionProps> = ({
  title,
  filter,
}) => {
  const { data, isLoading, isEmpty } = usePositionsFiltering();
  const { totalPortfolioUsd } = usePortfolioSummary();

  const positionGroups = useMemo(() => {
    const filtered = pickBy(
      mapValues(data, (positions) =>
        positions.filter(hasPositionDataToDisplay),
      ),
      (positions) => positions.length > 0 && filter(positions),
    );

    return Object.entries(filtered);
  }, [data, filter]);

  const { amount, progress } = useHoldingAmountProgress(
    positionGroups,
    getPositionValue,
    totalPortfolioUsd,
  );

  return (
    <PortfolioHoldingsSection
      title={title}
      amount={amount}
      progress={progress}
      shouldExpand={!isEmpty || isLoading}
      isLoading={isLoading}
    >
      {positionGroups.map(([symbol, positions]) => (
        <HoldingItemRow key={symbol}>
          <PositionSummaryRow positions={positions} />
        </HoldingItemRow>
      ))}
    </PortfolioHoldingsSection>
  );
};
