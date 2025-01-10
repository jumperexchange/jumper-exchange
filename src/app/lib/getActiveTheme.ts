import type { cookies } from 'next/headers';
import type { PartnerThemesData, StrapiResponseData } from '../../types/strapi';
import type { ThemeMode } from '../../types/theme';
import { getPartnerThemes } from './getPartnerThemes';

export type ActiveThemeResult = {
  themes: StrapiResponseData<PartnerThemesData>;
  activeTheme: string | undefined;
  themeMode: ThemeMode;
  isPartnerTheme: boolean;
};

// Handle
// /partner-theme
// /en/partner-theme
export async function getActiveTheme(
  cookiesHandler: ReturnType<typeof cookies>,
) {
  const partnerThemes = await getPartnerThemes();
  const cookieTheme = cookiesHandler.get('theme')?.value;
  const pathname = cookiesHandler.get('pathname')?.value || '/';
  const segments = pathname.split('/').slice(0, 3);

  if (segments.includes('superfest')) {
    segments.push('op');
  }

  const partnerThemeUids = new Set(
    partnerThemes.data.map((d) => d.attributes.uid),
  );

  const pathPartnerTheme = segments.find((themeId) =>
    partnerThemeUids.has(themeId),
  );

  const cookieThemeIsPartnerTheme = cookieTheme
    ? partnerThemeUids.has(cookieTheme)
    : false;

  const activeTheme =
    pathPartnerTheme || (cookieThemeIsPartnerTheme ? 'default' : cookieTheme);

  return {
    themes: partnerThemes.data,
    activeTheme: activeTheme,
    themeMode: cookiesHandler.get('themeMode')?.value as ThemeMode,
    isPartnerTheme: Boolean(pathPartnerTheme),
  };
}
