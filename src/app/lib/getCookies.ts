import type { ThemeModesSupported } from '@/types/settings';
import { cookies } from 'next/headers';

export function getCookies() {
  const cookieHandler = cookies();

  const activeThemeMode = cookieHandler.get('themeMode')?.value as
    | ThemeModesSupported
    | undefined;
  const activeTheme = cookieHandler.get('theme')?.value as
    | string
    | undefined;
  const welcomeScreenClosed = cookieHandler.get('welcomeScreenClosed')
    ?.value as 'false' | 'true' | undefined;

  return {
    activeTheme,
    activeThemeMode,
    welcomeScreenClosed,
  };
}
