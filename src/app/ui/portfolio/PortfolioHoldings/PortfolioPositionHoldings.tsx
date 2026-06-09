import { useMemo } from 'react';
import { mapValues, pickBy } from 'lodash';
import { usePositionsFiltering } from '@/providers/PortfolioProvider/filtering/PositionsFilteringContext';
import { usePortfolioSummary } from '@/providers/PortfolioProvider/PortfolioContext';
import { hasPositionDataToDisplay } from '@/components/composite/PositionCard/utils';
import { PositionSummaryRow } from '@/components/composite/PositionCard/components/PositionSummaryRow';
import type { PortfolioPosition } from '@/providers/PortfolioProvider/types';
import type { FC } from 'react';
import { PortfolioHoldingsSection } from './PortfolioHoldingsSection';
import { useHoldingAmountProgress } from './useHoldingAmountProgress';

interface PortfolioPositionHoldingsProps {
  title: string;
  filter: (positions: PortfolioPosition[]) => boolean;
}

type PositionGroup = [string, PortfolioPosition[]];

const getPositionValue = (position: PortfolioPosition) => position.netUsd;

export const PortfolioPositionHoldings: FC<PortfolioPositionHoldingsProps> = ({
  title,
  filter,
}) => {
  const { data, isLoading, isEmpty } = usePositionsFiltering();
  const { totalPortfolioUsd } = usePortfolioSummary();

  const positionGroups: PositionGroup[] = useMemo(() => {
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
      items={positionGroups}
      renderItem={([, positions]) => (
        <PositionSummaryRow positions={positions} />
      )}
    />
  );
};
