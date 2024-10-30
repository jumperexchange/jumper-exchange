import { type WidgetConfig } from '@lifi/widget';

import { CLEANING_ITEMS } from './constants';

import type { TItems } from '../types/types';
import { colors } from './theme';
import { publicRPCList } from '../../const/rpcList';

/************************************************************************************************
 * countExtraXPFromItems Function
 *

 * @param items - An array of TItems objects.
 * @returns The total extra XP as a number.
 *************************************************************************************************/
export function countExtraXPFromItems(items?: TItems): number {
  if (!items) {
    return 0;
  }
  return (
    items.soap * CLEANING_ITEMS.soap.boost +
    items.sponge * CLEANING_ITEMS.sponge.boost +
    items.cleanser * CLEANING_ITEMS.cleanser.boost
  );
}

/**************************************************************************************************
 * widgetConfig Configuration
 *
 * This configuration object defines the settings for the widget, including its appearance, theme,
 * and wallet connection behavior.
 *
 * Integrator: 'MOM'
 *************************************************************************************************/
export const widgetConfig: WidgetConfig = {
  variant: 'compact',
  appearance: 'dark',
  fromChain: 1151111081099710, //Solana
  toChain: 1151111081099710, //Solana
  hiddenUI: ['poweredBy'],
  sdkConfig: {
    apiUrl: process.env.NEXT_PUBLIC_LIFI_API_URL,
    routeOptions: {
      maxPriceImpact: 0.4,
    },
    rpcUrls: {
      ...JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS),
      ...publicRPCList,
    },
  },
  apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
  buildUrl: true,
  theme: {
    palette: {
      primary: {
        main: colors.pink[800],
      },
      text: {
        primary: '#ffffff',
        secondary: '#ffffff',
      },
      secondary: {
        main: colors.violet[300],
      },
      background: {
        default: colors.violet[200],
        paper: colors.violet[300],
      },
      grey: {
        300: colors.violet[300],
        800: colors.violet[400],
      },
    },
    container: {
      boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
      borderRadius: '32px',
      backgroundColor: colors.violet[300],
    },
  },
  integrator: 'MOM',
};
