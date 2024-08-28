// ----------------------------------------------------------------------

import type { PartnerThemesData } from '@/types/strapi';
import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { WidgetConfig } from '@lifi/widget';

export interface PortfolioProps {
  lastTotalValue: number;
  lastAddress?: string;
}
export interface PortfolioState extends PortfolioProps {
  setLastTotalValue: (portfolioLastValue: number) => void;
  setLastAddress: (lastAddress: string) => void;
}
