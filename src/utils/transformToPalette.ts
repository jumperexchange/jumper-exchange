import type { PartnerTheme, PartnerThemesData } from '@/types/strapi';
import type { PaletteColorOptions } from '@mui/material';

function transformToPaletteColorOptions(a: any): PaletteColorOptions {
  if (!a || Object.keys(a).includes('main')) {
    return a;
  }
  return { main: a };
}

export function transformCustomization(theme: PartnerTheme) {
  if (!theme.customization) {
    return theme;
  }
  return {
    ...theme,
    customization: {
      ...theme.customization,
      palette: Object.keys(theme.customization.palette || {}).reduce(
        (acc, key) => {
          acc[key] = transformToPaletteColorOptions(
            theme.customization?.palette?.[key],
          );
          return acc;
        },
        {} as Record<string, PaletteColorOptions>,
      ),
    },
  };
}

export function cleanThemeCustomization(theme: PartnerThemesData) {
  if (!theme) {
    return;
  }
  if (
    theme?.attributes?.lightConfig !== null &&
    theme?.attributes?.lightConfig?.customization?.palette
  ) {
    theme.attributes.lightConfig = transformCustomization(
      theme.attributes.lightConfig,
    );
  }
  if (
    !!theme?.attributes?.darkConfig !== null &&
    theme?.attributes?.darkConfig?.customization
  ) {
    theme.attributes.darkConfig = transformCustomization(
      theme.attributes.darkConfig,
    );
  }

  return theme;
}
