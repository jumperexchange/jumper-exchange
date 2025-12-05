import type { DefiPosition } from '@/types/jumper-backend';
import { groupBy } from 'lodash';
import { useMemo } from 'react';
import type { OrderEnum, SortByEnum } from '@/app/ui/portfolio/types';
import { OrderOptions } from '@/app/ui/portfolio/types';
import {
  defiGroupSortAccessors,
  sortPortfolioItems,
} from '@/app/ui/portfolio/utils';

const defaultGroupByProtocolName = (position: DefiPosition) =>
  position.protocol.name;

interface UseFormatDisplayDeFiPositionsOptions {
  sortBy?: SortByEnum;
  order?: OrderEnum;
}

export const useFormatDisplayDeFiPositions = (
  positions?: DefiPosition[],
  groupByFn: (position: DefiPosition) => string = defaultGroupByProtocolName,
  options: UseFormatDisplayDeFiPositionsOptions = {},
) => {
  const { sortBy, order = OrderOptions.ASC } = options;

  return useMemo(() => {
    const groupedData = groupBy(positions ?? [], groupByFn);
    let groups = Object.values(groupedData).filter((group) => group.length > 0);

    if (sortBy) {
      groups = sortPortfolioItems(
        groups,
        sortBy,
        order,
        defiGroupSortAccessors,
      );
    }

    return groups;
  }, [positions, groupByFn, sortBy, order]);
};
