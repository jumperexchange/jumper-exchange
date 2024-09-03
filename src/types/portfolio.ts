// ----------------------------------------------------------------------

import type { PartnerThemesData } from '@/types/strapi';
import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { WidgetConfig } from '@lifi/widget';

export interface PortfolioProps {
  lastTotalValue: number;
  lastAddresses?: string[];
}
export interface PortfolioState extends PortfolioProps {
  setLastTotalValue: (portfolioLastValue: number) => void;
  setLastAddresses: (lastAddresses: string[]) => void;
}
