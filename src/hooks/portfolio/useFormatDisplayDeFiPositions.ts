import type { DefiPosition } from '@/types/jumper-backend';
import { groupBy } from 'lodash';
import { useMemo } from 'react';

export const useFormatDisplayDeFiPositions = (
  positions?: DefiPosition[],
  groupByFn?: (position: DefiPosition) => string,
) => {
  return useMemo(() => {
    const groupedData = groupBy(positions ?? [], groupByFn);

    return Object.values(groupedData);
  }, [positions, groupByFn]);
};
