import type { PartnerThemesData } from '@/types/strapi';
import type { ThemeMode } from '@/types/theme';
import { formatTheme, getAvailableThemeModes } from '@/utils/formatTheme';
import type { Theme } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { getDefaultWidgetTheme } from 'src/config/widgetConfig';
import { darkTheme, lightTheme } from 'src/theme';

export function getPartnerTheme(
  themes?: PartnerThemesData[],
  activeTheme?: string,
) {
  return themes?.find((d) => d.attributes.uid === activeTheme)?.attributes;
}

export function getMuiTheme(
  themes?: PartnerThemesData[],
  activeTheme?: string,
  themeMode?: ThemeMode,
) {
  const partnerTheme = getPartnerTheme(themes, activeTheme);

  if (!partnerTheme) {
    if (['light', 'system'].includes(themeMode!)) {
      return lightTheme;
    } else {
      return darkTheme;
    }
  }

  const formattedTheme = formatTheme(partnerTheme);
  const baseTheme = getAvailableThemeModes(partnerTheme).includes('light')
    ? lightTheme
    : darkTheme;

  return deepmerge(baseTheme, formattedTheme.activeMUITheme);
}

export function getWidgetTheme(
  currentTheme: Theme,
  activeTheme?: string,
  themes?: PartnerThemesData[],
) {
  const defaultWidgetTheme = getDefaultWidgetTheme(currentTheme);
  const partnerThemeAttributes = getPartnerTheme(themes, activeTheme);

  const widgetTheme = partnerThemeAttributes
    ? {
        config: deepmerge(
          defaultWidgetTheme.config,
          formatTheme(partnerThemeAttributes).activeWidgetTheme,
        ),
      }
    : defaultWidgetTheme;

  return widgetTheme;
}

/**
 * If resolved theme is system we need to try read from cookie first
 */
export function getEffectiveThemeMode(
  themeMode?: ThemeMode,
  resolvedTheme?: string,
): ThemeMode {
  if (resolvedTheme === 'system') {
    return themeMode || 'system';
  }
  return (resolvedTheme || themeMode || 'system') as ThemeMode;
}
