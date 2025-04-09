import type { PartnerThemesData, StrapiResponseData } from '../../types/strapi';
import type { ThemeMode } from '../../types/theme';
import { getPartnerThemes } from './getPartnerThemes';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { useThemeStore } from '@/stores/theme';

export type ActiveThemeResult = {
  themes: StrapiResponseData<PartnerThemesData>;
  activeTheme: string | undefined;
  themeMode: ThemeMode;
  isPartnerTheme: boolean;
};

// Handle
// /partner-theme
// /en/partner-theme
// TODO: Fix superfest
export async function getActiveTheme(cookiesHandler: ReadonlyRequestCookies) {
  const partnerThemes = await getPartnerThemes();
  const [themeMode, activeTheme, configTheme, setThemeMode] = useThemeStore((state) => [
    state.themeMode,
    state.activeTheme,
    state.configTheme,
    state.setThemeMode,
  ]);
  const cookieTheme = activeTheme;
  const pathname = cookiesHandler.get('pathname')?.value || '/';
  const segments = pathname.split('/').slice(0, 3);

  if (segments.includes('superfest')) {
    segments.push('op');
  }

  const partnerThemeUids = new Set(partnerThemes.data.map((d) => d?.uid));

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
    themeMode: themeMode,
    isPartnerTheme: Boolean(pathPartnerTheme),
  };
}
