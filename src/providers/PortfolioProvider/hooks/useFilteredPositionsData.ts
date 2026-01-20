import { useMemo } from 'react';
import { usePortfolio } from '../PortfolioContext';
import type { UsePositionsDataParams } from './usePositionsData';
import { usePositionsData } from './usePositionsData';

export const useFilteredPositionsData = (
  filters: UsePositionsDataParams['filter'],
) => {
  const { processors } = usePortfolio();
  const rawFilteredData = usePositionsData({ filter: filters });
  const processedData = useMemo(() => {
    return processors.positions(rawFilteredData);
  }, [rawFilteredData, processors]);

  return processedData;
};
