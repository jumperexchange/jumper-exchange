import type { PartnerThemesData } from '@/types/strapi';
import type { ActiveTheme } from '@/types/theme';

export interface ThemeProviderProps {
  children: React.ReactNode;
  activeTheme?: ActiveTheme;
  /** Overrides the route partner-theme meta tag (Storybook). */
  overrideMetaTheme?: string;
  themes?: PartnerThemesData[];
}
