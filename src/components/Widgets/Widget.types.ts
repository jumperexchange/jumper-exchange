'use client';
import type { StarterVariantType, ThemeVariantType } from '@/types/internal';
import { ChainId } from '@lifi/sdk';
import type { Appearance } from '@lifi/widget';
import type { BlogWidgetProps } from '../Blog/BlogWidget';
import { ThemeModesSupported } from '@/types/settings';

export const refuelAllowChains: ChainId[] = [
  ChainId.ETH,
  ChainId.POL,
  ChainId.BSC,
  ChainId.DAI,
  ChainId.FTM,
  ChainId.AVA,
  ChainId.ARB,
  ChainId.OPT,
  ChainId.BAS,
  ChainId.MAM,
];

export const themeAllowChains: ChainId[] = [
  ChainId.ETH,
  ChainId.BAS,
  ChainId.OPT,
  ChainId.ARB,
  ChainId.AVA,
  ChainId.BSC,
];

export interface WidgetProps extends Omit<BlogWidgetProps, 'allowChains'> {
  allowChains?: number[];
  widgetIntegrator?: string;
  starterVariant: StarterVariantType;
  themeVariant?: ThemeVariantType;
  activeTheme?: ThemeModesSupported;
}
