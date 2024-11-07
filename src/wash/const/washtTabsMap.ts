'use client';

import { WashLinkMap } from './washLinkMap';

interface WashTabsMapType {
  [key: string]: {
    index: number;
    destination: string;
  };
}

export const WashTabsMap: WashTabsMapType = {
  WashAbout: {
    index: 0,
    destination: WashLinkMap.WashAbout,
  },
  WashNFT: {
    index: 1,
    destination: WashLinkMap.WashNFT,
  },
  WashCollection: {
    index: 2,
    destination: WashLinkMap.WashCollection,
  },
};
