import type { PartnerThemesData } from '@/types/strapi';
import { formatTheme, getAvailableThemeModes } from '@/utils/formatTheme';
import type { PaletteMode, Theme } from '@mui/material';
import { deepmerge } from '@mui/utils';
import {
  getDefaultWidgetTheme,
  getDefaultWidgetThemeV2,
} from 'src/config/widgetConfig';
import { themeCustomized } from 'src/theme/theme';
import type { Appearance } from '@lifi/widget';

export function getPartnerTheme(
  themes?: PartnerThemesData[],
  activeTheme?: string,
) {
  return themes?.find((d) => d?.uid === activeTheme);
}

// @deprecated
export function getMuiTheme(
  themeMode: Appearance,
  themes?: PartnerThemesData[],
  activeTheme?: string,
) {
  const partnerTheme = getPartnerTheme(themes, activeTheme);

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

// @deprecated
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

export function getWidgetThemeV2(
  mode: PaletteMode,
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
