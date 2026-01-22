'use client';

import type { UsePositionsDataParams } from './usePositionsData';
import { useProcessedPositions } from './useProcessedPositions';

export const useFilteredPositionsData = (
  filters: UsePositionsDataParams['filter'],
) => {
  return useProcessedPositions({ filter: filters });
};
