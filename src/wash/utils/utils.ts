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
 * getPepeImage Function
 *
 * This function returns the appropriate image filename based on the progress and color provided.
 * It uses a switch statement to determine the correct image stage based on the progress value.
 *
 * @param progress - The progress value (default is 0).
 * @param color - The color string (optional).
 * @returns The image filename corresponding to the progress and color.
 *************************************************************************************************/
export function getPepeImage(progress: number = 0, color?: string): string {
  switch (true) {
    case progress >= 0 && progress < 20:
      return `${color}-stage-1.png`;
    case progress >= 20 && progress < 40:
      return `${color}-stage-2.png`;
    case progress >= 40 && progress < 60:
      return `${color}-stage-3.png`;
    case progress >= 60 && progress < 80:
      return `${color}-stage-4.png`;
    default:
      return `${color}-stage-5.png`;
  }
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
    items.item1 * CLEANING_ITEMS.soap.boost +
    items.item2 * CLEANING_ITEMS.sponge.boost +
    items.item3 * CLEANING_ITEMS.cleanser.boost
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
