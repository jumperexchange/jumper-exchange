import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';

enum Theme {
  Dark = 'dark',
  Light = 'light',
  System = 'system',
}
const LOCALSTROAGE_THEME = 'theme';

const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const updateInitialTheme = () => {
    const localPreference: Theme = localStorage.getItem(
      LOCALSTROAGE_THEME,
    ) as Theme;

    updateThemePreference(localPreference);
  };

  const updateThemePreference = (preference: Theme) => {
    let selectedDarkMode: boolean = isDarkMode;

    if (preference === Theme.Dark) {
      selectedDarkMode = true;
      localStorage.setItem(LOCALSTROAGE_THEME, Theme.Dark);
    } else if (preference === Theme.System) {
      selectedDarkMode = prefersDarkMode;
      localStorage.setItem(LOCALSTROAGE_THEME, Theme.System);
    } else {
      selectedDarkMode = false;
      localStorage.setItem(LOCALSTROAGE_THEME, Theme.Light);
    }

    setIsDarkMode(selectedDarkMode);
  };

  useEffect(() => {
    updateInitialTheme();
  }, []);

  return { isDarkMode, updateThemePreference };
};

export default useTheme;
