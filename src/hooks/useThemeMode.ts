import type { ThemeModesSupported } from '@/types/settings';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useSettingsStore } from 'src/stores/settings';
import type { PartnerTheme } from 'src/types/strapi';

interface useThemeModeReturn {
  themeMode: PartnerTheme;
  setThemeMode: (themeMode: ThemeModesSupported) => void;
}

export const useThemeMode = (
  initialThemeMode?: ThemeModesSupported,
): useThemeModeReturn => {
  const [cookie, setCookie] = useCookies(['themeMode']);

  const [themeMode, setThemeMode] = useSettingsStore((state) => [
    state.themeMode,
    state.setThemeMode,
  ]);

  const updateThemeMode = (themeMode: ThemeModesSupported) => {
    setThemeMode(themeMode);
    setCookie('themeMode', themeMode, {
      path: '/', // Cookie available across the entire website
      expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Cookie expires in one month
      sameSite: true,
    });
  };

  useEffect(() => {
    if (!cookie.themeMode) {
      // @ts-expect-error: ignoring 'undefined' is not assignable to type
      updateThemeMode(initialThemeMode);
    }
  }, []); // todo: check dep array

  return {
    // @ts-expect-error: ignoring Type 'string' is not assignable to type 'PartnerTheme'.
    themeMode: themeMode,
    setThemeMode: updateThemeMode,
  };
};
