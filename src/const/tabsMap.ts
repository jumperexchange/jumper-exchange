'use client';

import type { WidgetSubvariant } from '@lifi/widget';
import { LinkMap } from './linkMap';

interface TabsMapType {
  [key: string]: {
    index: number;
    variant: WidgetSubvariant | 'buy' | 'private';
    destination: string[];
  };
}

export const TabsMap: TabsMapType = {
  Exchange: {
    index: 0,
    variant: 'default',
    destination: [LinkMap.Exchange],
  },
  Refuel: {
    index: 1,
    variant: 'refuel',
    destination: [LinkMap.Gas, LinkMap.Refuel],
  },
  Private: {
    index: 2,
    variant: 'private',
    destination: [LinkMap.Private],
  },
  Buy: {
    index: 3,
    variant: 'buy',
    destination: [LinkMap.Buy],
  },
};
