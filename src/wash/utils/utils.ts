import { type WidgetConfig } from '@lifi/widget';

import { CLEANING_ITEMS } from './constants';

import type { TItems } from '../types/types';

/************************************************************************************************
 * Joins the given classes into a single string.
 * @example cl('foo', 'bar') // 'foo bar'
 * @example cl('foo', false && 'bar') // 'foo'
 *
 * @param classes the classes to be joined
 * @returns the joined classes
 *************************************************************************************************/
export function cl(...classes: (string | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

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

/************************************************************************************************
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
  sdkConfig: {
    rpcUrls: {
      '1151111081099710': [process.env.NEXT_PUBLIC_SOLANA_RPC_URI as string],
    },
  },
  theme: {
    palette: {
      primary: {
        main: '#FF009D',
      },
      text: {
        primary: '#ffffff',
        secondary: '#ffffff',
      },
      secondary: {
        main: '#28065F',
      },
      background: {
        default: '#28065F',
        paper: '#390083',
      },
      grey: {
        300: '#28065F',
        800: '#420097',
      },
    },
    container: {
      boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
      borderRadius: '32px',
      backgroundColor: '#28065F',
    },
  },
  integrator: 'MOM',
};

/**************************************************************************************************
 * getItem is needed here because cleaning items have different stroke colors depends on UI place.
 *************************************************************************************************/
export const getItem = (id: keyof typeof CLEANING_ITEMS, color?: string) => {
  return {
    ...CLEANING_ITEMS[id],
    logo: color ? `/wash/${color}-stroke-${id}.png` : CLEANING_ITEMS[id].logo,
  };
};
