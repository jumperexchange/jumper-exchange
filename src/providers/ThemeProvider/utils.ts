import type { PartnerThemesData } from '@/types/strapi';
import type { ThemeMode } from '@/types/theme';
import { formatTheme, getAvailableThemeModes } from '@/utils/formatTheme';
import type { Theme } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { getDefaultWidgetTheme, getDefaultWidgetThemeV2 } from 'src/config/widgetConfig';
import { themeCustomized } from 'src/theme/theme';

export function getPartnerTheme(
  themes?: PartnerThemesData[],
  activeTheme?: string,
) {
  return themes?.find((d) => d?.uid === activeTheme);
}

export function getMuiTheme(
  themeMode: ThemeMode,
  themes?: PartnerThemesData[],
  activeTheme?: string,
) {
  const partnerTheme = getPartnerTheme(themes, activeTheme);

  console.log('getMuiTheme', themeCustomized, partnerTheme, themeMode);

  if (!partnerTheme) {
    if (['light', 'system'].includes(themeMode!)) {
      return deepmerge(themeCustomized, themeCustomized.colorSchemes['light']);
    } else {
      return deepmerge(themeCustomized, themeCustomized.colorSchemes['dark']);
    }
  }

  const formattedTheme = formatTheme(partnerTheme);
  const baseTheme = getAvailableThemeModes(partnerTheme).includes('light')
    ? themeCustomized.colorSchemes['light']
    : themeCustomized.colorSchemes['dark'];

  return deepmerge(baseTheme, formattedTheme.activeMUITheme);
}

export function getWidgetTheme(
  currentTheme: Theme,
  activeTheme?: string,
  themes?: PartnerThemesData[],
) {
  const defaultWidgetTheme = getDefaultWidgetTheme(currentTheme);
  const partnerThemeAttributes = getPartnerTheme(themes, activeTheme);

  console.log('partnerThemeAttributes', partnerThemeAttributes);

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

export function getWidgetThemeV2(
  mode: Theme,
  activeTheme?: string,
  themes?: PartnerThemesData[],
) {
  const defaultWidgetTheme = getDefaultWidgetThemeV2(mode);
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
