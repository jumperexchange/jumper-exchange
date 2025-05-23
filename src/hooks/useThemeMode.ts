import { useColorScheme, useMediaQuery } from '@mui/material';

export const useThemeMode = () => {
  const { mode } = useColorScheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const themeMode =
    mode === 'system' || !mode ? (prefersDarkMode ? 'dark' : 'light') : mode;
  return themeMode;
};
