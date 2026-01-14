import { useEffect, useMemo } from 'react';
import { usePortfolio } from '../PortfolioContext';
import type { UsePositionsDataParams } from './usePositionsData';
import { usePositionsData } from './usePositionsData';
import { positionQueryRegistry } from '../registry/PositionQueryRegistry';

export const usePositionsQueryExecutor = (
  id: string,
  filters: UsePositionsDataParams['filter'],
) => {
  const { processors } = usePortfolio();
  const rawFilteredData = usePositionsData({ filter: filters });
  const processedData = useMemo(() => {
    return processors.positions(rawFilteredData);
  }, [rawFilteredData, processors.positions]);

  useEffect(() => {
    positionQueryRegistry.notifySubscribers(id, processedData);
  }, [id, processedData]);
  return processedData;
};
