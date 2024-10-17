import type { PartnerThemesData } from '@/types/strapi';
import type { ActiveTheme, ThemeMode } from '@/types/theme';

export interface ThemeProviderProps {
  children: React.ReactNode;
  activeTheme?: ActiveTheme;
  themes?: PartnerThemesData[];
  themeMode?: ThemeMode;
}
