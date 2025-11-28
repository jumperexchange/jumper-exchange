import type { DefiPosition } from '@/types/jumper-backend';
import { groupBy } from 'lodash';
import { useMemo } from 'react';

const defaultGroupByProtocolName = (position: DefiPosition) =>
  position.protocol.name;

export const useFormatDisplayDeFiPositions = (
  positions?: DefiPosition[],
  groupByFn: (position: DefiPosition) => string = defaultGroupByProtocolName,
) => {
  return useMemo(() => {
    const groupedData = groupBy(positions ?? [], groupByFn);

    return Object.values(groupedData).filter((group) => group.length > 0);
  }, [positions, groupByFn]);
};
