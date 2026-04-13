'use client';
import type { StarterVariantType } from '@/types/internal';
import { ChainId } from '@lifi/sdk';
import type { BlogWidgetProps } from '../Blog/BlogWidget';

export const themeAllowChains: ChainId[] = [
  ChainId.ETH,
  ChainId.BAS,
  ChainId.OPT,
  ChainId.ARB,
  ChainId.AVA,
  ChainId.BSC,
];

export const ExtendedChainId = {
  HYPE: 998 as ChainId,
} as Record<string, ChainId>;

export interface WidgetProps extends Omit<BlogWidgetProps, 'allowChains'> {
  allowChains?: number[];
  allowToChains?: number[];
  widgetIntegrator?: string;
  starterVariant: StarterVariantType;
  activeTheme?: string;
  autoHeight?: boolean;
}
