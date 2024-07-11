import { useCookies } from 'react-cookie';
import { useSettingsStore } from 'src/stores/settings';
import type { PartnerTheme } from 'src/types/strapi';
import { useEffect } from 'react';
import { ThemeModesSupported } from '@/types/settings';
import { useMediaQuery } from '@mui/material';

interface useThemeModeReturn {
  themeMode: PartnerTheme,
  setThemeMode: (themeMode: ThemeModesSupported) => void;
}

export const useThemeMode = (
  initialThemeMode?: ThemeModesSupported,
): useThemeModeReturn => {
  // const [activeTheme, setActiveTheme] = useState(initialTheme);
  const [cookie, setCookie] = useCookies([
    'themeMode',
  ]);

  const [themeMode, setThemeMode] =
    useSettingsStore((state) => [state.themeMode, state.setThemeMode]);

  const updateThemeMode = (themeMode: ThemeModesSupported) => {
    // console.log('UPDATETHEMEMODE', themeMode)
    setThemeMode(themeMode);
    setCookie('themeMode', themeMode, {
      path: '/', // Cookie available across the entire website
      expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Cookie expires in one month
      sameSite: true,
    });
  };

  useEffect(() => {
    if (!cookie.themeMode) {
      // @ts-expect-error
      updateThemeMode(initialThemeMode);
    }
  }, []);

  return {
    // @ts-expect-error
    themeMode: themeMode,
    setThemeMode: updateThemeMode,
  };
};
