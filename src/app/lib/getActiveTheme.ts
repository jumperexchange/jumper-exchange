import type { PartnerThemesData, StrapiResponseData } from '@/types/strapi';
import { ThemeModes, type ThemeMode } from '@/types/theme';
import type { cookies } from 'next/headers';
import { getPartnerThemes } from './getPartnerThemes';

export type ActiveThemeResult = {
  themes: StrapiResponseData<PartnerThemesData>;
  activeTheme: string | undefined;
  themeMode: ThemeMode;
};

export async function getActiveTheme(
  cookiesHandler: ReturnType<typeof cookies>,
) {
  const partnerThemes = await getPartnerThemes();
  const cookieTheme = cookiesHandler.get('theme')?.value;
  const pathname = cookiesHandler.get('pathname')?.value || '/';
  const segments = pathname.split('/');
  // Handle
  // /partner-theme
  // /en/partner-theme
  const possibleThemes = segments.slice(0, 2);

  const partnerThemesSet = new Set(
    partnerThemes.data.map((d) => d.attributes.uid),
  );

  if (possibleThemes.includes('superfest')) {
    possibleThemes.push('op');
  }

  const pathTheme =
    pathname === '/'
      ? 'default'
      : possibleThemes.find((themeId) => partnerThemesSet.has(themeId));

  const isCookieThemeStandard = ThemeModes.includes(cookieTheme as ThemeMode);

  const activeTheme =
    pathTheme === 'default' && isCookieThemeStandard
      ? cookieTheme
      : pathTheme || cookieTheme;

  return {
    themes: partnerThemes.data,
    activeTheme,
    themeMode: cookiesHandler.get('themeMode')?.value as ThemeMode,
  };
}
