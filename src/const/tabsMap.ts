'use client';

import { LinkMap } from './linkMap';

interface TabsMapType {
  [key: string]: {
    index: number;
    variant: string;
    destination: string[];
  };
}

export const TabsMap: TabsMapType = {
  Simple: {
    index: 0,
    variant: 'default',
    destination: [LinkMap.Exchange],
  },
  Advanced: {
    index: 1,
    variant: 'advanced',
    destination: ['advanced'],
  },
};
