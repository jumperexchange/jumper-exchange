import type { PartnerThemesData } from '@/types/strapi';
import type { ActiveTheme } from '@/types/theme';

export interface ThemeProviderProps {
  children: React.ReactNode;
  activeTheme?: ActiveTheme;
  themes?: PartnerThemesData[];
}
